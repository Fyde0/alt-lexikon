interface IWord {
    id: number,
    word: string,
    language: "en" | "sv",
    class: string | null,
    comment: string | null,
    translations: string | null,
    compounds: string | null,
    rest: string | null
}

export function isIWord(obj: any): obj is IWord {
    return typeof obj.word === "string" &&
        (obj.language === "en" || obj.language === "sv") &&
        (obj.class === null || typeof obj.class === "string") &&
        (obj.comment === null || typeof obj.comment === "string") &&
        (obj.translations === null || typeof obj.translations === "string") &&
        (obj.compounds === null || typeof obj.compounds === "string") &&
        (obj.rest === null || typeof obj.rest === "string")
}

export function isIWordArray(obj: any[]): obj is IWord[] {
    return obj.every(word => isIWord(word))
}

// only word and language for search endpoint
export type IWordLang = Pick<IWord, "word" | "language">

export function isIWordLang(obj: any): obj is IWordLang {
    return typeof obj.word === "string" &&
        (obj.language === "en" || obj.language === "sv")
}

export function isIWordLangArray(obj: any[]): obj is IWordLang[] {
    return obj.every(word => isIWordLang(word))
}

export default IWord