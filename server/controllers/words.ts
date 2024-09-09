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
    // returns word, language, match and key of match
    // e.g. tog => ta / sv / tog / inflection
    // everything is without ( and ), clean_value is without |
    let sqlQuery = `
            SELECT DISTINCT
                Words.clean_value AS word, 
                Words.language, 
                CASE
                    WHEN Words.clean_value LIKE :query THEN Words.clean_value
                    WHEN Translations.value LIKE :query THEN Translations.value
                    WHEN Inflections.value LIKE :query THEN Inflections.value
                    WHEN Compounds.clean_value LIKE :query THEN Compounds.clean_value
                    WHEN Derivations.value LIKE :query THEN Derivations.value
                    WHEN Variants.value LIKE :query THEN Variants.value
                    ELSE NULL
                END AS match,
                CASE 
                    WHEN Words.clean_value LIKE :query THEN 'Word'
                    WHEN Translations.value LIKE :query THEN 'Translation'
                    WHEN Inflections.value LIKE :query THEN 'Inflection'
                    WHEN Compounds.clean_value LIKE :query THEN 'Compound'
                    WHEN Derivations.value LIKE :query THEN 'Derivations'
                    WHEN Variants.value LIKE :query THEN 'Variants'
                    ELSE NULL
                END AS key
            FROM Words
            LEFT JOIN Translations ON Words.id = Translations.word_id
            LEFT JOIN Inflections ON Words.id = Inflections.word_id
            LEFT JOIN Compounds ON Words.id = Compounds.word_id
            LEFT JOIN Derivations ON Words.id = Derivations.word_id
            LEFT JOIN Variants ON Words.id = Variants.word_id
            WHERE Words.clean_value LIKE :query
            OR Translations.value LIKE :query
            OR Inflections.value LIKE :query
            OR Compounds.clean_value LIKE :query
            OR Derivations.value LIKE :query
            OR Variants.value LIKE :query
    `
    const parameters = { "query": query + "%" }

    logDebug("Running query: " + query)

    const results = file_db
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
        // then, other exact match
        if (a.match === query) return -1
        if (b.match === query) return 1
        // then, shorter first
        return a.match.length - b.match.length
    })

    logDebug("Filtering results for query: " + query)

    // only keep result if there isn't a word match
    // e.g. "skärm" => remove all the translations like screen and shield
    // since there is already the exact match "skärm"
    // this can probably be done in SQL?
    const filteredResults = results.filter((res, _i, results) => {
        // check if there is a word match
        const wordMatch = results.some(result => {
            if (result.match === res.match && result.key === "Word") {
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

    // search query
    // the original website searches in the middle of translations but I don't think that's right
    // e.g. "road" finds "avfart" because the translation is "exit (road)"
    const sqlQuery = `
        SELECT DISTINCT Words.*,
        CASE 
            WHEN Words.clean_value = :word THEN 'Word'
            WHEN Translations.value = :word THEN 'Translation'
            WHEN Inflections.value = :word THEN 'Inflection'
            WHEN Compounds.clean_value = :word THEN 'Compound'
            WHEN Derivations.value = :word THEN 'Derivations'
            WHEN Variants.value = :word THEN 'Variants'
            ELSE NULL
        END AS key
        FROM Words
        LEFT JOIN Translations ON Words.id = Translations.word_id
        LEFT JOIN Inflections ON Words.id = Inflections.word_id
        LEFT JOIN Compounds ON Words.id = Compounds.word_id
        LEFT JOIN Derivations ON Words.id = Derivations.word_id
        LEFT JOIN Variants ON Words.id = Variants.word_id
        WHERE Words.clean_value = :word
        OR Translations.value = :word
        OR Inflections.value = :word
        OR Compounds.clean_value = :word
        OR Derivations.value = :word
        OR Variants.value = :word
    `
    const parameters = { "word": word }

    logDebug("Running query for word: " + word)

    const results = file_db
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
        // I don't think this is needed
        //                v
        // then, exact word match
        // keep DB order if same word
        // if (a.word === word && b.word === word) {
        //     return a.id - b.id
        // }
        // if (a.word === word) return -1
        // if (b.word === word) return 1
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