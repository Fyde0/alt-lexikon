import { Request, Response } from "express"
// 
import log from "../helpers/log"
import { file_db } from ".."
import { IWordLang } from "../interfaces/word"

function searchWords(req: Request, res: Response) {
    const { query } = req.query

    // TODO validate

    // search query
    // TODO include verb inflections and translations
    let sqlQuery = `
            SELECT DISTINCT word, language
            FROM Words 
            WHERE word LIKE :query
        `
    let parameters = { "query": query + "%" }

    const results = file_db
        .prepare(sqlQuery)
        .all(parameters) as IWordLang[]

    // simple sorting by length
    results.sort((a, b) => {
        // exact match first
        if (a.word === query) return -1
        if (b.word === query) return 1
        // shorter first
        return a.word.length - b.word.length
    })

    // only 20 results
    results.splice(20)

    return res.status(200).json(results)
}

function specificWord(req: Request, res: Response) {
    const { word } = req.params

    // TODO validate

    // search query
    // TODO include verb inflections and translations
    let sqlQuery = `
            SELECT *
            FROM Words 
            WHERE word = :word
        `
    let parameters = { "word": word }

    const results = file_db
        .prepare(sqlQuery)
        .all(parameters) as IWordLang[]

    // TODO sort
    // prioritize verb infinit form?

    return res.status(200).json(results)
}

export default {
    searchWords,
    specificWord
}