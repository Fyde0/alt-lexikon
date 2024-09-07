import { AppShell, Box, Flex, Group, Portal, Title } from "@mantine/core"
// 
import SearchInput from "../components/SearchInput"
import Results from "../components/Results"
import { useParams } from "react-router-dom"

function Root() {
    const { word } = useParams()

    const maxWidth = "750px"
    const headerHeight = 60
    const inputHeight = "calc(2.25rem * var(--mantine-scale)"
    const inputMarginY = "var(--mantine-spacing-md)"

    return (
        <AppShell
            header={{ height: headerHeight }}
            maw={maxWidth} p={0} mx="auto"
        >

            <AppShell.Header style={{ boxShadow: "var(--mantine-shadow-md)" }}>
                <Group h="100%" maw={maxWidth} px="md" mx="auto">
                    <Title order={1} size="h3" fw={400}>
                        <Flex align="center" gap="sm">
                            <i className="fa-solid fa-book"></i> <span>Alt-Lexikon</span>
                        </Flex>
                    </Title>
                </Group>
            </AppShell.Header>

            <AppShell.Main>

                {/* Fixed search input */}
                <Portal>
                    <Flex
                        align="center" justify="center"
                        w="100vw" h={inputHeight + " + " + inputMarginY + " * 2"}
                        pos="fixed"
                        top={headerHeight}
                        // bottom={0}
                        style={{
                            zIndex: 100,
                            backgroundColor: "var(--mantine-color-body)",
                            borderBottom: "1px solid var(--mantine-color-default-border)",
                            // borderTop: "1px solid var(--mantine-color-default-border)",
                            boxShadow: "var(--mantine-shadow-md)"
                        }}
                    >
                        {/* 
                        the key makes the input rerender when the word changes
                        it's needed so the text in the input updates and is selected
                        */}
                        <SearchInput key={word} word={word} />
                    </Flex>
                </Portal>

                {/* Results */}
                <Box
                    mt={inputHeight + " + " + inputMarginY + " * 2"}
                    // mb={inputHeight + " + " + inputMarginY + " * 2"}
                >
                    <Results word={word} />
                </Box>

            </AppShell.Main>

        </AppShell>
    )
}

export default Root