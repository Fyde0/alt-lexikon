interface ISettings {
    expandResults: boolean,
    searchOnBottom: boolean,
    showCharacters: boolean
}

export const defaultSettings: ISettings = {
    expandResults: false,
    searchOnBottom: false,
    showCharacters: false
}

export default ISettings