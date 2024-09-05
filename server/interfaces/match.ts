// search query match from DB
interface IMatch {
    word: string,
    language: "en" | "sv",
    match: string,
    key: string
}

export function isIMatch(obj: any): obj is IMatch {
    return typeof obj.word === "string" &&
        (obj.language === "en" || obj.language === "sv") &&
        typeof obj.match === "string" &&
        typeof obj.key === "string"
}

export function isIMatchArray(obj: any[]): obj is IMatch[] {
    return obj.every(word => isIMatch(word))
}

export default IMatch