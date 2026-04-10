/** @spec docs/specs/P0.C-2-env-and-settings.md */

import { describe, expect, it, beforeEach } from "vitest";
import { useSettingsStore } from "./settings-store";

describe("settings-store", () => {
  beforeEach(() => {
    // Reset store to defaults between tests
    useSettingsStore.setState({ theme: "system", locale: "zh-CN" });
  });

  it("has correct default values", () => {
    const state = useSettingsStore.getState();
    expect(state.theme).toBe("system");
    expect(state.locale).toBe("zh-CN");
  });

  it("setTheme updates theme", () => {
    useSettingsStore.getState().setTheme("dark");
    expect(useSettingsStore.getState().theme).toBe("dark");

    useSettingsStore.getState().setTheme("light");
    expect(useSettingsStore.getState().theme).toBe("light");
  });

  it("setLocale updates locale", () => {
    useSettingsStore.getState().setLocale("en-US");
    expect(useSettingsStore.getState().locale).toBe("en-US");

    useSettingsStore.getState().setLocale("zh-CN");
    expect(useSettingsStore.getState().locale).toBe("zh-CN");
  });

  it("setTheme does not affect locale", () => {
    useSettingsStore.getState().setLocale("en-US");
    useSettingsStore.getState().setTheme("dark");
    expect(useSettingsStore.getState().locale).toBe("en-US");
  });
});
