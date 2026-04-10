/** @spec docs/specs/P0.C-4-hello-claude.md */

import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { resolveModel } from "@aiclassroom/llm";
import type { ModelConfig } from "@aiclassroom/llm";
import { serverEnv } from "@/env";

const cfg: ModelConfig = {
  provider: "anthropic",
  model: "claude-sonnet-4-6",
  ...(serverEnv.ANTHROPIC_API_KEY ? { apiKey: serverEnv.ANTHROPIC_API_KEY } : {}),
};

export async function POST(req: Request) {
  const body = (await req.json()) as { messages: UIMessage[] };

  const messages = await convertToModelMessages(body.messages);

  const model = resolveModel(cfg);

  const result = streamText({
    model,
    system: "You are a helpful AI teaching assistant for AIClassRoom. Keep replies concise.",
    messages,
  });

  return result.toUIMessageStreamResponse();
}
