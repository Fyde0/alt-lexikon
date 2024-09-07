import { isWithInflection, isWithTranslation, WordDataEntry, WordDataEntryWithInflection, WordDataEntryWithTranslation } from "../../../interfaces/word"

// overloads for return type
export function handleEntry(
    entry?: WordDataEntry[] | WordDataEntryWithInflection[] | WordDataEntryWithTranslation[],
    flag?: string,
    returnAsArray?: false
): string | undefined
export function handleEntry(
    entry?: WordDataEntry[] | WordDataEntryWithInflection[] | WordDataEntryWithTranslation[],
    flag?: string,
    returnAsArray?: true
): string[] | undefined
// converts an entry to a string for displaying (or an array for links and lists)
export function handleEntry(
    entry?: WordDataEntry[] | WordDataEntryWithInflection[] | WordDataEntryWithTranslation[],
    flag?: string, // optional flag for translation
    returnAsArray?: boolean // returns as array instead of string if true
) {
    let newEntry = entry?.map(item => {
        // entry value and comment in parenthesis
        let itemString = item.value + handleParenthesis(item.comment)
        // add inflection if it exists
        if (isWithInflection(item)) {
            itemString += handleParenthesis(item.inflection, "Inflection")
        }
        // add translation if it exists, add flag if in props
        if (isWithTranslation(item)) {
            itemString += handleTranslations(item.translation, flag)
        }
        return itemString
    })
    if (returnAsArray) {
        return newEntry
    }
    return newEntry?.join(", ")
}

export function handleParenthesis(text?: string, description?: string) {
    if (text) {
        let content = ""
        if (description) {
            content += description + ": "
        }
        content += text
        return " (" + content + ")"
    }
    return ""
}

export function handleTranslations(translations?: WordDataEntry[], otherflag?: string) {
    if (translations && translations.length > 0) {

        // ignore empty translations
        let trans = translations.map(trans => {
            return trans.value !== "" && trans.value
        }).join(", ")

        if (otherflag) {
            trans = otherflag + " " + trans
        }

        return ", " + trans
    }
    return ""
}