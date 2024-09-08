import { Stack } from "@mantine/core"
// 
import Word from "../Word"
import { getWord } from "../../api/words"

function Results({ word }: { word: string | undefined }) {

    const getWordQuery = getWord({ word: word })

    if (getWordQuery.isSuccess) {
        return (
            <Stack gap={0} pb="md">
                {
                    getWordQuery.data.map((word, i) => {
                        return <Word key={i} word={word} />
                    })
                }
            </Stack>
        )
    }
}

export default Results