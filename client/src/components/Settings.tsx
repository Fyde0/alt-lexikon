import { Text, Checkbox, CheckIcon, ColorSwatch, Group, rem, Stack, useComputedColorScheme, useMantineColorScheme } from "@mantine/core"
import useSettingsStore from "../stores/settings"
import { accentColors } from "../interfaces/settings"

function Settings() {
    const { settings, setSettings } = useSettingsStore()
    const { setColorScheme } = useMantineColorScheme({ keepTransitions: true })
    const computedColorScheme = useComputedColorScheme()

    return (
        <Stack>
            <Checkbox
                label="Light mode"
                checked={computedColorScheme === "light"}
                onChange={() => setColorScheme(computedColorScheme === "dark" ? "light" : "dark")}
            />
            <Checkbox
                label="Expand results automatically"
                checked={settings.expandResults}
                onChange={() => setSettings({ ...settings, expandResults: !settings.expandResults })}
            />
            <Checkbox
                label="Search bar on bottom"
                description="Moves the search bar at the bottom of the screen, useful on mobile"
                checked={settings.searchOnBottom}
                onChange={() => setSettings({ ...settings, searchOnBottom: !settings.searchOnBottom })}
            />
            <Checkbox
                label="Show åäö buttons"
                checked={settings.showCharactersButtons}
                onChange={() => setSettings({ ...settings, showCharactersButtons: !settings.showCharactersButtons })}
            />
            <Checkbox
                label="Select query after search"
                description="Automatically selects the text in the search field after searching"
                checked={settings.selectQueryAfterSearch}
                onChange={() => setSettings({ ...settings, selectQueryAfterSearch: !settings.selectQueryAfterSearch })}
            />
            <Checkbox
                label="Double click to search"
                description="Search a word when double clicking it in the results screen"
                checked={settings.doubleClickToSearch}
                onChange={() => setSettings({ ...settings, doubleClickToSearch: !settings.doubleClickToSearch })}
            />
            <Text component="label">Accent color
                <Group mt="sm">
                    {accentColors.map((color, i) => {
                        return (
                            <ColorSwatch
                                key={i}
                                component="button"
                                color={"var(--mantine-color-" + color + "-filled)"}
                                onClick={() => setSettings({ ...settings, accentColor: color })}
                                style={{ color: "var(--mantine-color-text)", cursor: "pointer" }}
                            >
                                {settings.accentColor === color && <CheckIcon style={{ width: rem(12), height: rem(12) }} />}
                            </ColorSwatch>
                        )
                    })}
                </Group>
            </Text>
        </Stack>
    )
}

export default Settings