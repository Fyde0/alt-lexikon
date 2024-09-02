import { Request, Response } from "express"
import { z } from "zod"
// 
import { file_db } from ".."
import { serverError } from "../helpers/serverError"
import { logDebug } from "../helpers/log"
import { isIWordDBArray, isIWordDBLangArray } from "../interfaces/wordDB"
import IWord from "../interfaces/word"

function searchWords(req: Request, res: Response) {
    const { query } = req.query
    logDebug("Searching query: " + query)

    const validationResult = z.object({
        query: z.coerce.string().max(50, "Too long!")
    }).safeParse({ query })

    if (!validationResult.success) {
        // 422 Unprocessable Content
        logDebug("Validation failed for query: " + query)
        return res.status(422).json({ "error": validationResult.error.issues[0].message })
    }

    // search query
    // TODO include verb inflections, translations and compounds
    let sqlQuery = `
            SELECT DISTINCT word, language
            FROM Words 
            WHERE word LIKE :query
        `
    let parameters = { "query": query + "%" }

    const results = file_db
        .prepare(sqlQuery)
        .all(parameters)

    if (!isIWordDBLangArray(results)) {
        return serverError(res, "Invalid object from DB in searchWords function.")
    }

    // simple sorting by length
    results.sort((a, b) => {
        // exact match first
        if (a.word === query) return -1
        if (b.word === query) return 1
        // shorter first
        return a.word.length - b.word.length
    })

    // only 6 results
    results.splice(6)

    // 200 OK
    logDebug("Returning results for query: " + query)
    return res.status(200).json(results)
}

function specificWord(req: Request, res: Response) {
    const { word } = req.params
    logDebug("Getting word: " + word)

    // search query
    // TODO include verb inflections, translations and compounds
    let sqlQuery = `
            SELECT *
            FROM Words 
            WHERE word = :word
        `
    let parameters = { "word": word }

    const results = file_db
        .prepare(sqlQuery)
        .all(parameters)

    if (!isIWordDBArray(results)) {
        return serverError(res, "Invalid object from DB in specificWord function.")
    }

    const normalResults: IWord[] = results.map(word => {
        return {
            word: word.word,
            language: word.language,
            class: word.class !== null ? word.class : undefined,
            comment: word.comment !== null ? word.comment : undefined,
            data: word.rest !== null ? JSON.parse(word.rest) : undefined
        }
    })

    // TODO sort
    // prioritize verb infinite form?

    if (normalResults.length === 0) {
        // 404 Not Found
        logDebug("No results for word: " + word)
        return res.status(404).json(normalResults)
    }

    // 200 OK
    logDebug("Returning results for word: " + word)
    return res.status(200).json(normalResults)
}

export default {
    searchWords,
    specificWord
}