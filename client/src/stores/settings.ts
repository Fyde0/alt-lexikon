import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// 
import ISettings, { defaultSettings } from "../interfaces/settings"

interface SettingsState {
    settings: ISettings,
    setSettings: (settings: ISettings) => void
}

const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            settings: defaultSettings,
            setSettings: (settings) => set({ settings })
        }),
        {
            name: "lexikon-settings"
        }
    )
)

export default useSettingsStore