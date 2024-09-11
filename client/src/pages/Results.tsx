import { useNavigate, useParams } from "react-router-dom"
import { Box, Center, Loader, Stack, Text } from "@mantine/core"
// 
import Word from "../components/Word"
import ErrorMessage from "../components/ErrorMessage"
import { getWord } from "../api/words"
import useSettingsStore from "../stores/settings"
import validateQuery from "../helpers/validateQuery"

export function Component() {
    const { word } = useParams()
    const navigate = useNavigate()
    const { settings } = useSettingsStore()

    // const wordValidation = queryValidationSchema.safeParse({ query: word })
    const wordValidation = validateQuery(word)
    const getWordQuery = getWord({ word: wordValidation.success ? word : "" })

    if (!wordValidation.success) {
        return (
            <Center h={100} ta="center">
                {wordValidation.message}
            </Center>
        )
    }

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

    // searches a word when double clicking it
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