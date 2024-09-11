interface ISettings {
    accentColor: AccentColor,
    font: Font,
    expandResults: boolean,
    searchOnBottom: boolean,
    showCharactersButtons: boolean,
    selectQueryAfterSearch: boolean,
    doubleClickToSearch: boolean
}

export const defaultSettings: ISettings = {
    accentColor: "blue",
    font: "Default",
    expandResults: false,
    searchOnBottom: false,
    showCharactersButtons: false,
    selectQueryAfterSearch: false,
    doubleClickToSearch: true
}

// const-assertion, makes TS see the array values as literals
export const accentColors = ["pink", "grape", "violet", "indigo", "blue", "cyan", "teal", "green", "lime", "yellow", "orange"] as const
// so we can make types from arrays
type AccentColor = typeof accentColors[number]

export const fonts = ["Default", "Montserrat", "Inter", "Open Sans", "Noto Serif", "Libre Baskerville"] as const
export type Font = typeof fonts[number]

export default ISettings