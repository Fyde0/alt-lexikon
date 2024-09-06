import { Request, Response } from "express"
import { z } from "zod"
// 
import { file_db } from ".."
import { serverError } from "../helpers/serverError"
import { logDebug } from "../helpers/log"
import { isIMatchArray } from "../interfaces/match"
import { isIWordDBArray } from "../interfaces/wordDB"
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
    // searches for words, translations and inflections
    // returns word, language, match and key of match
    // e.g. tog => ta / sv / tog / inflection
    let sqlQuery = `
            SELECT DISTINCT
                word, 
                language, 
                CASE
                    WHEN word LIKE :query THEN word
                    WHEN Translations.value LIKE :query THEN Translations.value
                    WHEN Inflections.value LIKE :query THEN Inflections.value
                    WHEN REPLACE(Compounds.value, '|', '') LIKE :query THEN Compounds.value
                    ELSE NULL
                END AS match,
                CASE 
                    WHEN word LIKE :query THEN 'Word'
                    WHEN Translations.value LIKE :query THEN 'Translation'
                    WHEN Inflections.value LIKE :query THEN 'Inflection'
                    WHEN REPLACE(Compounds.value, '|', '') LIKE :query THEN 'Compound'
                    ELSE NULL
                END AS key
            FROM Words
            LEFT JOIN Translations ON Words.id = Translations.word_id
            LEFT JOIN Inflections ON Words.id = Inflections.word_id
            LEFT JOIN Compounds ON Words.id = Compounds.word_id
            WHERE word LIKE :query
            OR Translations.value LIKE :query
            OR Inflections.value LIKE :query
            OR REPLACE(Compounds.value, '|', '') LIKE :query
    `
    const parameters = { "query": query + "%" }

    const results = file_db
        .prepare(sqlQuery)
        .all(parameters)

    if (!isIMatchArray(results)) {
        return serverError(res, "Invalid object from DB in searchWords function.")
    }

    results.sort((a, b) => {
        // exact word match first
        if (a.match === query && a.key === "Word") return -1
        if (b.match === query && b.key === "Word") return 1
        // then, other exact match
        if (a.match === query) return -1
        if (b.match === query) return 1
        // then, shorter first
        return a.match.length - b.match.length
    })

    // only 6 results
    results.splice(10)

    // 200 OK
    logDebug("Returning results for query: " + query)
    return res.status(200).json(results)
}

function specificWord(req: Request, res: Response) {
    const { word } = req.params
    logDebug("Getting word: " + word)

    // search query
    const sqlQuery = `
        SELECT DISTINCT Words.*,
        CASE 
            WHEN Words.word = :word THEN 'Word'
            WHEN Translations.value = :word THEN 'Translation'
            WHEN Inflections.value = :word THEN 'Inflection'
            WHEN REPLACE(Compounds.value, '|', '') = :word THEN 'Compound'
            ELSE NULL
        END AS key
        FROM Words
        LEFT JOIN Translations ON Words.id = Translations.word_id
        LEFT JOIN Inflections ON Words.id = Inflections.word_id
        LEFT JOIN Compounds ON Words.id = Compounds.word_id
        WHERE Words.word = :word
        OR Translations.value = :word
        OR Inflections.value = :word
        OR REPLACE(Compounds.value, '|', '') = :word
    `
    const parameters = { "word": word }

    const results = file_db
        .prepare(sqlQuery)
        .all(parameters)

    if (!isIWordDBArray(results)) {
        return serverError(res, "Invalid object from DB in specificWord function.")
    }

    results.sort((a, b) => {
        // exact inflection match first
        if (a.key === "Inflection" && b.key === "Inflection") {
            // this should keep the DB order when they have the same inflection
            // e.g. when searching "tog", keeps the same order for all "ta" entries
            return a.id - b.id
        }
        if (a.key === "Inflection") return -1
        if (b.key === "Inflection") return 1
        // same for compound
        if (a.key === "Compound" && b.key === "Compound") { return a.id - b.id }
        if (a.key === "Compound") return -1
        if (b.key === "Compound") return 1
        // then, exact word match
        // keep DB order if same word
        if (a.word === word && b.word === word) {
            return a.id - b.id
        }
        if (a.word === word) return -1
        if (b.word === word) return 1
        return 0
    })

    const normalResults: IWord[] = results.map(word => {
        return {
            id: word.id,
            word: word.word,
            language: word.language,
            class: word.class !== null ? word.class : undefined,
            comment: word.comment !== null ? word.comment : undefined,
            data: word.rest !== null ? JSON.parse(word.rest) : undefined
        }
    })

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