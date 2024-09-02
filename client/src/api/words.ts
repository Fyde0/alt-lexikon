import { queryOptions, useQuery } from "@tanstack/react-query"
import IWord, { isIWordArray } from "../interfaces/word"

export function searchWords({ query }: { query: string }) {
    return useQuery(queryOptions({
        queryKey: ["searchWords", query],
        queryFn: async (): Promise<IWord[]> => {

            const url = new URL(import.meta.env.VITE_API_URL + "/words/")
            url.searchParams.append("query", query)

            return fetch(url.toString())
                .then(async (response) => {
                    const data = await response.json()
                    if (response.ok && isIWordArray(data)) {
                        return data
                    }
                    throw new Error(data.error)
                })
        },
        enabled: query.length > 2
    }))
}

export function getWord({ word }: { word: string }) {
    return useQuery(queryOptions({
        queryKey: ["getWord", word],
        queryFn: async (): Promise<IWord[]> => {

            const url = new URL(import.meta.env.VITE_API_URL + "/words/" + word)

            return fetch(url.toString())
                .then(async (response) => {
                    const data = await response.json()
                    if (response.ok && isIWordArray(data)) {
                        return data
                    }
                    throw new Error(data.error)
                })
        },
        enabled: word.length > 0
    }))
}