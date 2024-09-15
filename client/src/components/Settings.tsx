import {
    Text, Checkbox, CheckIcon, ColorSwatch, Group, rem, Stack, useComputedColorScheme,
    useMantineColorScheme, DEFAULT_THEME, useCombobox, Combobox, InputBase
} from "@mantine/core"
import useSettingsStore from "../stores/settings"
import { accentColors, Font, fonts } from "../interfaces/settings"

function Settings() {
    const { settings, setSettings } = useSettingsStore()
    const { setColorScheme } = useMantineColorScheme({ keepTransitions: true })
    const computedColorScheme = useComputedColorScheme()

    const combobox = useCombobox()

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
                label="Focus input on window focus"
                description="Automatically focuses the search input on window focus (e.g. when you come back from a different tab)"
                checked={settings.focusInputOnWindowFocus}
                onChange={() => setSettings({ ...settings, focusInputOnWindowFocus: !settings.focusInputOnWindowFocus })}
            />
            <Checkbox
                label="Select query on focus"
                description="Automatically selects the text in the search field on focus (e.g. after displaying results, or when focusing the window if the option above is enabled)"
                checked={settings.selectQueryOnFocus}
                onChange={() => setSettings({ ...settings, selectQueryOnFocus: !settings.selectQueryOnFocus })}
            />
            <Checkbox
                label="Double click to search"
                description="Searches a word when double clicking it in the results screen"
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
            <Text component="label">Font
                <Combobox
                    store={combobox}
                    onOptionSubmit={(value) => {
                        setSettings({ ...settings, font: value as Font || DEFAULT_THEME.fontFamily })
                    }}
                >
                    <Combobox.Target>
                        <InputBase
                            component="button" type="button" pointer
                            rightSection={<Combobox.Chevron />}
                            onClick={() => combobox.toggleDropdown()}
                            mt="sm" maw="15rem"
                        >
                            {settings.font}
                        </InputBase>
                    </Combobox.Target>

                    <Combobox.Dropdown>
                        <Combobox.Options>
                            {fonts.map((item) => (
                                <Combobox.Option value={item} key={item}>
                                    <Group gap="xs">
                                        {item === settings.font && <CheckIcon size={12} />}
                                        <Text span ff={item}>{item}</Text>
                                    </Group>
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    </Combobox.Dropdown>
                </Combobox>
            </Text>

            <Text size="sm" ml="auto">
                <a className="dimmedA" href="https://github.com/Fyde0/alt-lexikon/releases" target="_blank">
                    {import.meta.env.MODE === "development" && "alt-lexikon dev mode (v" + __APP_VERSION__ + ")"}
                    {import.meta.env.MODE === "production" && "alt-lexikon v" + __APP_VERSION__}
                </a>
            </Text>
        </Stack>
    )
}

export default Settings