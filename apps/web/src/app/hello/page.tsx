/** @spec docs/specs/P0.C-4-hello-claude.md */

"use client";

import { useState, type FormEvent } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { Button, Input } from "@aiclassroom/ui";

const transport = new DefaultChatTransport({ api: "/api/hello" });

export default function HelloPage() {
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    void sendMessage({ text });
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-8">
      <h1 className="text-foreground text-2xl font-bold">Hello Claude</h1>
      <p className="text-muted-foreground text-sm">
        End-to-end smoke test: type a message and see Claude respond via streaming.
      </p>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-lg px-4 py-2 ${
              m.role === "user"
                ? "bg-primary text-primary-foreground self-end"
                : "bg-muted text-foreground self-start"
            }`}
          >
            <p className="text-xs font-medium opacity-70">{m.role === "user" ? "You" : "Claude"}</p>
            <p className="whitespace-pre-wrap">
              {m.parts
                .filter((p): p is { type: "text"; text: string } => p.type === "text")
                .map((p) => p.text)
                .join("")}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Claude something..."
          disabled={status === "streaming"}
        />
        <Button type="submit" disabled={status === "streaming"}>
          {status === "streaming" ? "..." : "Send"}
        </Button>
      </form>
    </main>
  );
}
