import { useParams } from "react-router-dom"
import { ActionIcon, AppShell, Box, Flex, Group, Modal, Portal, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
// 
import SearchInput from "../components/SearchInput"
import Results from "../components/Results"
import Settings from "../components/Settings"
import useSettingsStore from "../stores/settings"

function Root() {
    const { word } = useParams()
    const { settings } = useSettingsStore()
    const [areSettingsOpen, { open: openSettings, close: closeSettings }] = useDisclosure(false)

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
                <Group
                    h="100%" maw={maxWidth}
                    px="md" mx="auto"
                    align="center"
                    justify="space-between"
                >
                    {/* Logo and title */}
                    <Title order={1} size="h3" fw={400}>
                        <Flex align="center" gap="sm">
                            <i className="fa-solid fa-book" /> <span>Alt-Lexikon</span>
                        </Flex>
                    </Title>

                    {/* Settings icon */}
                    <ActionIcon
                        variant="outline" size="lg" aria-label="Settings"
                        onClick={openSettings}
                    >
                        <i className="fa-solid fa-gear" />
                    </ActionIcon>
                </Group>
            </AppShell.Header>

            <AppShell.Main>

                {/* Settings modal */}
                <Modal
                    opened={areSettingsOpen} onClose={closeSettings}
                    size="auto"
                    title="Settings"
                    overlayProps={{
                        backgroundOpacity: 0.55,
                        blur: 3,
                    }}
                >
                    <Settings />
                </Modal>

                {/* Fixed search input */}
                <Portal>
                    <Flex
                        align="center" justify="center"
                        w="100vw" h={inputHeight + " + " + inputMarginY + " * 2"}
                        pos="fixed"
                        // conditional position based on settings
                        top={settings.searchOnBottom ? undefined : headerHeight}
                        bottom={settings.searchOnBottom ? 0 : undefined}
                        style={{
                            zIndex: 100,
                            backgroundColor: "var(--mantine-color-body)",
                            // conditional border based on input position
                            borderBottom: settings.searchOnBottom ? undefined : "1px solid var(--mantine-color-default-border)",
                            borderTop: settings.searchOnBottom ? "1px solid var(--mantine-color-default-border)" : undefined,
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
                    // considitional margin based on input position
                    mt={settings.searchOnBottom ? undefined : inputHeight + " + " + inputMarginY + " * 2"}
                    mb={settings.searchOnBottom ? inputHeight + " + " + inputMarginY + " * 2" : undefined}
                >
                    <Results word={word} />
                </Box>

            </AppShell.Main>

        </AppShell>
    )
}

export default Root