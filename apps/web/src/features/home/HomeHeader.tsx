/** @spec docs/specs/P1.A-1-home-layout.md */

"use client";

import { Globe, Moon, Settings } from "lucide-react";
import { Button } from "@aiclassroom/ui";

/** 右上角工具栏 — 语言 / 主题 / 设置图标按钮 */
export function HomeHeader() {
  return (
    <header className="fixed right-0 top-0 z-50 flex items-center gap-1 p-4">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Switch language"
        className="text-muted-foreground hover:text-foreground"
      >
        <Globe className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className="text-muted-foreground hover:text-foreground"
      >
        <Moon className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Settings"
        className="text-muted-foreground hover:text-foreground"
      >
        <Settings className="h-5 w-5" />
      </Button>
    </header>
  );
}
