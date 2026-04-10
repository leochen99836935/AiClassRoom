/** @spec docs/specs/P0.C-2-env-and-settings.md */

"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Theme = "light" | "dark" | "system";
export type Locale = "zh-CN" | "en-US";

export interface SettingsState {
  theme: Theme;
  locale: Locale;
}

export interface SettingsActions {
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  immer((set) => ({
    theme: "system",
    locale: "zh-CN",

    setTheme: (theme) =>
      set((state) => {
        state.theme = theme;
      }),

    setLocale: (locale) =>
      set((state) => {
        state.locale = locale;
      }),
  })),
);
