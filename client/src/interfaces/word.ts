interface IWord {
    word: string,
    language: "en" | "sv",
    class?: string,
    comment?: string,
    data?: any
}

export function isIWord(obj: any): obj is IWord {
    return typeof obj.word === "string" &&
        (obj.language === "en" || obj.language === "sv")
}

export function isIWordArray(obj: any[]): obj is IWord[] {
    return obj.every(word => isIWord(word))
}

export default IWord