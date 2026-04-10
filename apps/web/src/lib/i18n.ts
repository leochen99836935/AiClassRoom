/** @spec docs/specs/P1.A-2-i18n-switch.md */

import { useCallback } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import type { Locale } from "@/stores/settings-store";

// ---------------------------------------------------------------------------
// Translation dictionary
// ---------------------------------------------------------------------------

const messages = {
  "zh-CN": {
    "home.slogan": "多智能体互动课堂的生成式学习",
    "home.placeholder": "输入你想学习的主题，例如：量子计算入门、新员工信息安全培训...",
    "home.send": "发送",
    "home.role": "同学",
    "home.generate": "生成课程 ▸▸",
    "home.footer": "AIClassRoom · 开源项目",
    "theme.light": "浅色",
    "theme.dark": "深色",
    "theme.system": "跟随系统",
    "locale.zhCN": "简体中文",
    "locale.enUS": "English",
  },
  "en-US": {
    "home.slogan": "Generative Learning in Multi-Agent Interactive Classroom",
    "home.placeholder": "Enter a topic you'd like to learn, e.g.: Intro to quantum computing...",
    "home.send": "Send",
    "home.role": "Student",
    "home.generate": "Generate ▸▸",
    "home.footer": "AIClassRoom · Open Source Project",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    "locale.zhCN": "简体中文",
    "locale.enUS": "English",
  },
} as const;

export type MessageKey = keyof (typeof messages)["zh-CN"];

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/** Simple client-side translation hook. Returns t(key) → string. */
export function useT() {
  const locale = useSettingsStore((s) => s.locale);

  const t = useCallback(
    (key: MessageKey): string => {
      return messages[locale][key];
    },
    [locale],
  );

  return t;
}

export function getMessages(locale: Locale) {
  return messages[locale];
}
