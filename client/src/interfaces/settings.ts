interface ISettings {
    accentColor: AccentColor,
    expandResults: boolean,
    searchOnBottom: boolean,
    showCharactersButtons: boolean,
    selectQueryAfterSearch: boolean,
    doubleClickToSearch: boolean
}

export const defaultSettings: ISettings = {
    accentColor: "blue",
    expandResults: false,
    searchOnBottom: false,
    showCharactersButtons: false,
    selectQueryAfterSearch: true,
    doubleClickToSearch: true
}

// const-assertion, makes TS see the array values as literals
export const accentColors = ["pink", "grape", "violet", "indigo", "blue", "cyan", "teal", "green", "lime", "yellow", "orange"] as const
// so we can make types from arrays
type AccentColor = typeof accentColors[number]

export default ISettings