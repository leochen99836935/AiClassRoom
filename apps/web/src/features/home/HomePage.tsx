/** @spec docs/specs/P1.A-1-home-layout.md */

"use client";

import { useCallback } from "react";
import { GraduationCap } from "lucide-react";
import { useT } from "@/lib/i18n";
import { HomeHeader } from "./HomeHeader";
import { ChatInput } from "./ChatInput";

export function HomePage() {
  const t = useT();

  const handleSubmit = useCallback((text: string) => {
    // Phase 1 后续任务会接入 lessonStore + 路由跳转到生成流程
    console.log("[HomePage] submit:", text);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col">
      <HomeHeader />

      {/* Main content — vertically centered */}
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-8">
        {/* Logo + slogan */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-2xl">
              <GraduationCap className="text-primary h-8 w-8" />
            </div>
            <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
              AIClassRoom
            </h1>
          </div>
          <p className="text-muted-foreground text-center text-sm tracking-wide md:text-base">
            {t("home.slogan")}
          </p>
        </div>

        {/* Chat input */}
        <ChatInput onSubmit={handleSubmit} />

        {/* Footer */}
        <p className="text-muted-foreground/50 text-xs">{t("home.footer")}</p>
      </main>
    </div>
  );
}
