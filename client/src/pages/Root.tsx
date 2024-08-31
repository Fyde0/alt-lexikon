import { AppShell, Flex, Group, Title } from "@mantine/core"
import SearchInput from "../components/SearchInput"

function Root() {

    const maxWidth = "500px"

    return (
        <AppShell
            header={{ height: { base: 60, md: 70, lg: 80 } }}
            maw={maxWidth} p="md" mx="auto"
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
                <SearchInput />
            </AppShell.Main>

        </AppShell>
    )
}

export default Root