import { Request, Response } from "express"
// 
import { mem_db } from ".."
import { serverError } from "../helpers/serverError"
import { logDebug } from "../helpers/log"
import { isIMatchArray } from "../interfaces/match"
import { isIWordDBArray } from "../interfaces/wordDB"
import IWord from "../interfaces/word"
import validateQuery from "../helpers/validateQuery"

function searchWords(req: Request, res: Response) {
    const { query } = req.query
    logDebug("Searching query: " + query)

    logDebug("Validating query: " + query)

    // min length 3
    const validationResult = validateQuery(query, 3)

    if (!validationResult.success) {
        // 422 Unprocessable Content
        logDebug("Validation failed for query: " + query)
        return res.status(422).json({ "error": validationResult.message })
    }

    // search query
    // returns word, language, match and key of match
    // e.g. tog => ta / sv / tog / inflection
    // everything is without ( and ), value is without |
    // see /server/tools/XMLToSQLite.py for more info
    let sqlQuery = `
            SELECT DISTINCT
                word, 
                language, 
                value AS match,
                key
            FROM Matches
            WHERE value LIKE :query
            COLLATE NOCASE
    `
    const parameters = { "query": query + "%" }

    logDebug("Running query: " + query)

    const results = mem_db
        .prepare(sqlQuery)
        .all(parameters)

    logDebug("Validating results for query: " + query)

    if (!isIMatchArray(results)) {
        return serverError(res, "Invalid object from DB in searchWords function.")
    }

    logDebug("Sorting results for query: " + query)

    results.sort((a, b) => {
        // exact word match first
        if (a.match === query && a.key === "Word") return -1
        if (b.match === query && b.key === "Word") return 1
        // then, other exact match (eg variants, inflections, etc)
        if (a.match === query) return -1
        if (b.match === query) return 1
        // then, shorter first
        return a.match.length - b.match.length
    })

    logDebug("Filtering results for query: " + query)

    // keep result if 1) there isn't a word match for the same word
    // e.g. "skärm" => remove all the translations like screen and shield
    // since there is already the exact match "skärm"
    // or 2) if there isn't already a match for the same word
    // e.g. "bil" => remove all non word matches, like bilen (inflection)
    // since there is already the word match "bil"
    // this can probably be done in SQL? but maybe it's slower
    const filteredResults = results.filter((res, _i, results) => {
        // check if there is a word match or a match for the same word
        const wordMatch = results.some(result => {
            if ((result.match === res.match || result.word === res.word) && result.key === "Word") {
                return true
            }
        })
        // if yes and this isn't it, remove this result
        if (res.key !== "Word" && wordMatch) { return false }
        return true
    })

    // only 10 results
    filteredResults.splice(10)

    // 200 OK
    logDebug("Returning results for query: " + query)
    return res.status(200).json(filteredResults)
}

function specificWord(req: Request, res: Response) {
    const { word } = req.params
    logDebug("Getting word: " + word)

    logDebug("Validating word: " + word)
    const validationResult = validateQuery(word)

    if (!validationResult.success) {
        // 422 Unprocessable Content
        logDebug("Validation failed for query: " + word)
        return res.status(422).json({ "error": validationResult.message })
    }

    // search query
    // the original website searches in the middle of translations but I don't think that's right
    // e.g. "road" finds "avfart" because the translation is "exit (road)"
    const sqlQuery = `
        SELECT DISTINCT 
            Words.*, Matches.key AS key
        FROM Words
        LEFT JOIN Matches ON Words.id = Matches.word_id
        WHERE Matches.value = :word
        COLLATE NOCASE
    `
    const parameters = { "word": word }

    logDebug("Running query for word: " + word)

    const results = mem_db
        .prepare(sqlQuery)
        .all(parameters)

    logDebug("Validating results for word: " + word)

    if (!isIWordDBArray(results)) {
        return serverError(res, "Invalid object from DB in specificWord function.")
    }

    logDebug("Sorting results for word: " + word)

    // Inflections, then Word, then Compound
    results.sort((a, b) => {
        // exact inflection match first
        if (a.key === "Inflection" && b.key === "Inflection") {
            // this should keep the DB order when they have the same inflection
            // e.g. when searching "tog", keeps the same order for all "ta" entries
            return a.id - b.id
        }
        if (a.key === "Inflection") return -1
        if (b.key === "Inflection") return 1
        // same for word
        if (a.key === "Word" && b.key === "Word") { return a.id - b.id }
        if (a.key === "Word") return -1
        if (b.key === "Word") return 1
        // same for compound
        if (a.key === "Compound" && b.key === "Compound") { return a.id - b.id }
        if (a.key === "Compound") return -1
        if (b.key === "Compound") return 1
        return 0
    })

    logDebug("Normalizing results for word: " + word)

    const normalResults: IWord[] = results.map(word => {
        return {
            id: word.id,
            value: word.value,
            language: word.language,
            class: word.class !== null ? word.class : undefined,
            comment: word.comment !== null ? word.comment : undefined,
            data: word.rest !== null ? JSON.parse(word.rest) : undefined
        }
    })

    if (normalResults.length === 0) {
        // 404 Not Found
        logDebug("No results for word: " + word)
        return res.status(404).json({ "error": "No results for " + word })
    }

    // 200 OK
    logDebug("Returning results for word: " + word)
    return res.status(200).json(normalResults)
}

export default {
    searchWords,
    specificWord
}