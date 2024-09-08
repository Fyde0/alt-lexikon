import { Box, Center, Loader, Stack, Text } from "@mantine/core"
// 
import Word from "../Word"
import ErrorMessage from "../ErrorMessage"
import { getWord } from "../../api/words"

function Results({ word }: { word: string | undefined }) {

    const getWordQuery = getWord({ word: word })

    if (getWordQuery.isFetching) {
        return (
            <Center h={100}>
                <Loader />
            </Center>
        )
    }

    if (getWordQuery.isError) {
        console.error(getWordQuery.error.message)
        return (
            <Center h={100} ta="center">
                <ErrorMessage />
            </Center>
        )
    }

    if (getWordQuery.isSuccess) {
        return (
            <Stack gap="sm" py="md">
                <Box px="sm">
                    Found {getWordQuery.data.length} results for <Text span fs="italic">{word}</Text>
                </Box>
                <Box style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}>
                    {
                        getWordQuery.data.map((word, i) => {
                            return <Word key={i} word={word} />
                        })
                    }
                </Box>
            </Stack>
        )
    }
}

export default Results