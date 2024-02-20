import { create } from "zustand";

import { getItem, removeItem, setItem } from "../utils/storage";

import { StorageEnum, ThemeMode } from "../utils/enum";

const useSettingStore = create((set) => ({
  settings: getItem(StorageEnum.Settings) || {
    themeMode: ThemeMode.Light,
  },
  actions: {
    setSettings: (settings) => {
      set({ settings });
      setItem(StorageEnum.Settings, settings);
    },
    clearSettings() {
      removeItem(StorageEnum.Settings);
    },
  },
}));

export const useSettings = () => useSettingStore((state) => state.settings);
export const useSettingActions = () =>
  useSettingStore((state) => state.actions);
