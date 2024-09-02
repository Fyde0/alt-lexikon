// word as stored in the database
interface IWordDB {
    id?: number,
    word: string,
    language: "en" | "sv",
    class: string | null,
    comment: string | null,
    translations: string | null,
    compounds: string | null,
    inflections: string | null,
    rest: string | null
}

export function isIWordDB(obj: any): obj is IWordDB {
    return typeof obj.word === "string" &&
        (obj.language === "en" || obj.language === "sv") &&
        (obj.class === null || typeof obj.class === "string") &&
        (obj.comment === null || typeof obj.comment === "string") &&
        (obj.translations === null || typeof obj.translations === "string") &&
        (obj.compounds === null || typeof obj.compounds === "string") &&
        (obj.inflections === null || typeof obj.inflections === "string") &&
        (obj.rest === null || typeof obj.rest === "string")
}

export function isIWordDBArray(obj: any[]): obj is IWordDB[] {
    return obj.every(word => isIWordDB(word))
}

// only word and language for search endpoint
export type IWordDBLang = Pick<IWordDB, "word" | "language">

export function isIWordDBLang(obj: any): obj is IWordDBLang {
    return typeof obj.word === "string" &&
        (obj.language === "en" || obj.language === "sv")
}

export function isIWordDBLangArray(obj: any[]): obj is IWordDBLang[] {
    return obj.every(word => isIWordDBLang(word))
}

export default IWordDB