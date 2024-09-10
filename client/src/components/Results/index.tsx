import { useNavigate } from "react-router-dom"
import { Box, Center, Loader, Stack, Text } from "@mantine/core"
// 
import Word from "../Word"
import ErrorMessage from "../ErrorMessage"
import { getWord } from "../../api/words"
import useSettingsStore from "../../stores/settings"

function Results({ word }: { word: string | undefined }) {
    const navigate = useNavigate()
    const { settings } = useSettingsStore()

    const getWordQuery = getWord({ word: word })

    if (getWordQuery.isFetching) {
        return (
            <Center h={100}>
                <Loader />
            </Center>
        )
    }

    if (getWordQuery.isError) {
        return (
            <Center h={100} ta="center">
                {
                    getWordQuery.error.message.includes("No results")
                        ?
                        <Box>
                            No results for <Text span fs="italic">{word}</Text>
                        </Box>
                        :
                        <ErrorMessage />
                }
            </Center>
        )
    }

    function handleDoubleClick() {
        if (settings.doubleClickToSearch) {
            const selection = window.getSelection()?.toString()
            if (selection && selection !== "") {
                navigate("/" + selection)
            }
        }
    }

    if (getWordQuery.isSuccess) {
        return (
            <Stack gap="sm" py="md">
                <Box px="sm">
                    Found {getWordQuery.data.length} results for <Text span fs="italic">{word}</Text>
                </Box>
                <Box style={{ borderTop: "1px solid var(--mantine-color-default-border)" }} onDoubleClick={handleDoubleClick}>
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