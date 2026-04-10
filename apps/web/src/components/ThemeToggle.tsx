/** @spec docs/specs/P1.A-3-theme-switch.md */

"use client";

import { Moon, Sun, Monitor, Check } from "lucide-react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@aiclassroom/ui";
import { useSettingsStore } from "@/stores/settings-store";
import type { Theme } from "@/stores/settings-store";

const themes: { value: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] =
  [
    { value: "light", label: "浅色", icon: Sun },
    { value: "dark", label: "深色", icon: Moon },
    { value: "system", label: "跟随系统", icon: Monitor },
  ];

export function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          className="text-muted-foreground hover:text-foreground"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-1">
        {themes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className="hover:bg-accent flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1 text-left">{label}</span>
            {theme === value && <Check className="text-primary h-4 w-4" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
