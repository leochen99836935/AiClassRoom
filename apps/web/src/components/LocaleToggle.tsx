/** @spec docs/specs/P1.A-2-i18n-switch.md */

"use client";

import { Globe, Check } from "lucide-react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@aiclassroom/ui";
import { useSettingsStore } from "@/stores/settings-store";
import type { Locale } from "@/stores/settings-store";

const locales: { value: Locale; label: string }[] = [
  { value: "zh-CN", label: "简体中文" },
  { value: "en-US", label: "English" },
];

export function LocaleToggle() {
  const locale = useSettingsStore((s) => s.locale);
  const setLocale = useSettingsStore((s) => s.setLocale);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Switch language"
          className="text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-36 p-1">
        {locales.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setLocale(value)}
            className="hover:bg-accent flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
          >
            <span className="flex-1 text-left">{label}</span>
            {locale === value && <Check className="text-primary h-4 w-4" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
