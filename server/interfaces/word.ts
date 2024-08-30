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

export default IWord