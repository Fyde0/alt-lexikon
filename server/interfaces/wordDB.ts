// word as stored in the database
interface IWordDB {
    id: number,
    value: string,
    language: "en" | "sv",
    class: string | null,
    comment: string | null,
    rest: string | null,
    key?: string
}

export function isIWordDB(obj: any): obj is IWordDB {
    return typeof obj.id === "number" &&
        typeof obj.value === "string" &&
        (obj.language === "en" || obj.language === "sv") &&
        (obj.class === null || typeof obj.class === "string") &&
        (obj.comment === null || typeof obj.comment === "string") &&
        (obj.rest === null || typeof obj.rest === "string")
}

export function isIWordDBArray(obj: any[]): obj is IWordDB[] {
    return obj.every(word => isIWordDB(word))
}

export default IWordDB