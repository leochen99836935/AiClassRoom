/** @spec docs/specs/P1.A-1-home-layout.md */

"use client";

import { type FormEvent, type KeyboardEvent, useCallback, useRef, useState } from "react";
import {
  Paperclip,
  Image,
  Mic,
  Search,
  Lightbulb,
  SendHorizontal,
  GraduationCap,
} from "lucide-react";
import { Button } from "@aiclassroom/ui";
import { useT } from "@/lib/i18n";

interface ChatInputProps {
  onSubmit: (text: string) => void;
}

/** 聊天式输入框区域 */
export function ChatInput({ onSubmit }: ChatInputProps) {
  const t = useT();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const trimmed = value.trim();
      if (!trimmed) return;
      onSubmit(trimmed);
      setValue("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    },
    [value, onSubmit],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  const hasContent = value.trim().length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border-border mx-auto w-full max-w-2xl rounded-2xl border shadow-lg"
    >
      {/* Top bar: role indicator + action buttons */}
      <div className="border-border/50 flex items-center justify-between border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <GraduationCap className="text-primary h-4 w-4" />
          </div>
          <span className="text-foreground/80 text-sm font-medium">{t("home.role")}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground mr-1 text-xs">{t("home.generate")}</span>
          {/* Role avatar placeholders */}
          <div className="flex -space-x-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted border-card h-6 w-6 rounded-full border-2" />
            ))}
          </div>
        </div>
      </div>

      {/* Textarea */}
      <div className="px-4 py-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={t("home.placeholder")}
          rows={2}
          className="placeholder:text-muted-foreground/60 text-foreground w-full resize-none bg-transparent text-sm leading-relaxed outline-none"
        />
      </div>

      {/* Bottom toolbar */}
      <div className="border-border/50 flex items-center justify-between border-t px-3 py-2">
        <div className="flex items-center gap-0.5">
          <ToolButton icon={Paperclip} label="Attach file" />
          <ToolButton icon={Image} label="Add image" />
          <ToolButton icon={Mic} label="Voice input" />
          <div className="bg-border mx-1 h-4 w-px" />
          <ToolButton icon={Search} label="Search enhance" />
          <ToolButton icon={Lightbulb} label="Deep thinking" />
        </div>
        <Button type="submit" size="sm" disabled={!hasContent} className="rounded-lg px-3">
          <SendHorizontal className="mr-1 h-4 w-4" />
          {t("home.send")}
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function ToolButton({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      className="text-muted-foreground hover:text-foreground h-8 w-8"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
