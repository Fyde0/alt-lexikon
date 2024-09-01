interface IWord {
    id: number,
    word: string,
    language: "en" | "sv",
    class: string,
    comment: string,
    translation: string,
    explanation: string,
    example: string,
    grammar: string,
    idiom: string,
    variant: string,
    paradigm: string,
    related: string,
    see: string,
    definition: string,
    synonym: string,
    phonetic: string,
    compound: string,
    url: string,
    derivation: string,
    use: string
}

// only word and language for search endpoint
export type IWordLang = Pick<IWord, "word" | "language">

export function isIWordLang(obj: any): obj is IWordLang {
    return typeof obj.word === "string" &&
        (obj.language === "en" || obj.language === "sv")
        ? true : false
}

export function isIWordLangArray(obj: any[]): obj is IWordLang[] {
    return obj.every(word => isIWordLang(word))
}

export default IWord