interface IWord {
    word: string,
    language: "en" | "sv",
    class?: string,
    comment?: string,
    data?: IWordData
}

interface IWordData {
    translation?: WordDataEntry[]
    grammar?: WordDataEntry[]
    phonetic?: WordDataEntry[]
    variant?: Variant[]
    paradigm?: Paradigm[]
    synonym?: Synonym[]
    definition?: WordDataEntry[]
    example?: WordDataEntryWithTranslation[]
    idiom?: WordDataEntryWithTranslation[]
    explanation?: WordDataEntryWithTranslation[]
}

type WordDataEntry = {
    value: string,
    comment?: string
}

type WordDataEntryWithTranslation = WordDataEntry & {
    translation: WordDataEntry[]
}

type Variant = WordDataEntry & {
    alt?: string
}

type Paradigm = {
    inflection: WordDataEntry[]
}

type Synonym = {
    value: string,
    level: string
}

export function isIWord(obj: any): obj is IWord {
    return typeof obj.word === "string" &&
        (obj.language === "en" || obj.language === "sv")
}

export function isIWordArray(obj: any[]): obj is IWord[] {
    return obj.every(word => isIWord(word))
}

export default IWord