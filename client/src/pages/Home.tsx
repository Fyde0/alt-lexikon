import { ActionIcon, Stack, Text } from "@mantine/core";

export function Component() {
    return (
        <Stack maw={550} mx="auto" my="md" px="sm">
            <Text>Alt-Lexikon is an alternative frontend for <a href="https://folkets-lexikon.csc.kth.se/" target="_blank">The People's Dictionary</a>.</Text>
            <Text>It aims to be a more modern interface with a responsive layout and a smoother user experience, Alt-Lexikon also has better search and a few settings to personalize your experience. </Text>
            <Text>If you want to contribute to the dictionary, please visit <a href="https://folkets-lexikon.csc.kth.se/" target="_blank">the original website</a>.</Text>
            <Text>Alt-Lexikon is fully open source.</Text>
            <ActionIcon
                variant="outline" size="xl" aria-label="Github"
                p={0} mx="auto"
                component="a" href="https://github.com/Fyde0/alt-lexikon" target="_blank"
            >
                <i className="fa-brands fa-github" style={{ fontSize: "175%" }} />
            </ActionIcon>
        </Stack>
    )
}