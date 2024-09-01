import { queryOptions, useQuery } from "@tanstack/react-query"

export function searchWords({ query }: { query: string }) {
    return useQuery(queryOptions({
        queryKey: ["words", query],
        queryFn: async () => {
            const url = import.meta.env.VITE_API_URL + "/words/?query=" + query
            return fetch(url)
                .then(async (response) => {
                    const data = await response.json()
                    if (response.ok) {
                        return data
                    }
                    throw new Error(data.error)
                })
        },
        enabled: query.length > 2
    }))
}