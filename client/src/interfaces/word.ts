interface IWord {
    id: number,
    value: string,
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
    definition?: WordDataEntryWithTranslation[]
    example?: WordDataEntryWithTranslation[]
    idiom?: WordDataEntryWithTranslation[]
    explanation?: WordDataEntryWithTranslation[]
    see?: WordDataEntryWithType[]
    related?: WordDataEntryWithTypeAndTranslation[]
    compound?: WordDataEntryWithInflectionAndTranslation[]
    derivation?: WordDataEntryWithInflectionAndTranslation[]
    use?: WordDataEntry[]
}

// All of this can be done with optional properties but strong typing helps my brain

export type WordDataEntry = {
    value: string,
    comment?: string,
}

export type WordDataEntryWithTranslation = WordDataEntry & {
    translation?: WordDataEntry[]
}

type WordDataEntryWithType = WordDataEntry & {
    type?: string
}

export type WordDataEntryWithInflection = WordDataEntry & {
    inflection?: string
}

type WordDataEntryWithTypeAndTranslation = WordDataEntryWithType & WordDataEntryWithTranslation
type WordDataEntryWithInflectionAndTranslation = WordDataEntryWithInflection & WordDataEntryWithTranslation

type Variant = WordDataEntry & {
    alt?: string
}

type Paradigm = {
    inflection?: WordDataEntry[]
}

type Synonym = WordDataEntry & {
    level?: string
}

export function isIWord(obj: any): obj is IWord {
    return typeof obj.id === "number" &&
        typeof obj.value === "string" &&
        (obj.language === "en" || obj.language === "sv")
}

export function isIWordArray(obj: any[]): obj is IWord[] {
    return obj.every(word => isIWord(word))
}

export function isWithTranslation(entry: WordDataEntry | WordDataEntryWithTranslation): entry is WordDataEntryWithTranslation {
    return (entry as WordDataEntryWithTranslation).translation !== undefined
}

export function isWithInflection(entry: WordDataEntry | WordDataEntryWithInflection): entry is WordDataEntryWithInflection {
    return (entry as WordDataEntryWithInflection).inflection !== undefined
}

export default IWord