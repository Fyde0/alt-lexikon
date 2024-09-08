import { Checkbox, Stack, useComputedColorScheme, useMantineColorScheme } from "@mantine/core"
import useSettingsStore from "../stores/settings"

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
                checked={settings.searchOnBottom}
                onChange={() => setSettings({ ...settings, searchOnBottom: !settings.searchOnBottom })}
            />
            <Checkbox
                label="Show åäö buttons"
                checked={settings.showCharacters}
                onChange={() => setSettings({ ...settings, showCharacters: !settings.showCharacters })}
            />
        </Stack>
    )
}

export default Settings