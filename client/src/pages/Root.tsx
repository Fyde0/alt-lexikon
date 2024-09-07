import { AppShell, Flex, Group, Stack, Title } from "@mantine/core"
// 
import SearchInput from "../components/SearchInput"
import Results from "../components/Results"
import { useParams } from "react-router-dom"

function Root() {
    const { word } = useParams()

    const maxWidth = "750px"

    return (
        <AppShell
            header={{ height: { base: 60, sm: 70 } }}
            maw={maxWidth} p="md" mx="auto"
            px={0}
        >

            <AppShell.Header>

                <Group h="100%" maw={maxWidth} px="md" mx="auto">
                    <Title order={1} size="h3" fw={400}>
                        <Flex align="center" gap="sm">
                            <i className="fa-solid fa-book"></i> <span>Alt-Lexikon</span>
                        </Flex>
                    </Title>
                </Group>

            </AppShell.Header>

            <AppShell.Main>

                <Stack>
                    {/* 
                    the key makes the input rerender when the word changes
                    it's needed so the text in the input updates and is selected
                     */}
                    <SearchInput key={word} word={word} />
                    <Results word={word} />
                </Stack>

            </AppShell.Main>

        </AppShell>
    )
}

export default Root