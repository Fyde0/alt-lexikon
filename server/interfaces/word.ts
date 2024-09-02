interface IWord {
    word: string,
    language: "en" | "sv",
    class?: string,
    comment?: string,
    data?: any
}

export default IWord