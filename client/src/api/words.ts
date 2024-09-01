import { queryOptions, useQuery } from "@tanstack/react-query"
import { isIWordLangArray, IWordLang } from "../interfaces/word"

export function searchWords({ query }: { query: string }) {
    return useQuery(queryOptions({
        queryKey: ["words", query],
        queryFn: async (): Promise<IWordLang[]> => {

            const url = new URL(import.meta.env.VITE_API_URL + "/words/")
            url.searchParams.append("query", query)

            return fetch(url.toString())
                .then(async (response) => {
                    const data = await response.json()
                    if (response.ok && isIWordLangArray(data)) {
                        return data
                    }
                    throw new Error(data.error)
                })
        },
        enabled: query.length > 2
    }))
}