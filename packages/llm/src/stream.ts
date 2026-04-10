/** @spec docs/specs/P0.B-3-llm-sdk-wrapper.md */

import { streamText, type ModelMessage } from "ai";

import type { TraceRecord } from "@aiclassroom/types";
import type { ModelConfig } from "./config";
import { resolveModel } from "./resolve-model";
import { createTrace, finalizeTrace } from "./trace";

export interface StreamOptions {
  messages: ModelMessage[];
  cfg: ModelConfig;
  agent?: string;
  node?: string;
}

export interface StreamResult {
  textStream: AsyncIterable<string>;
  /** 等流结束后获取 trace（需 await） */
  getTrace: () => Promise<Omit<TraceRecord, "id" | "lessonId">>;
}

/** 流式调用 LLM，返回 textStream + 延迟 trace */
export function stream(opts: StreamOptions): StreamResult {
  const model = resolveModel(opts.cfg);
  const partial = createTrace(opts.cfg, opts.agent ?? "unknown", opts.node ?? "direct", {
    messages: opts.messages,
  });

  const result = streamText({
    model,
    messages: opts.messages,
  });

  return {
    textStream: result.textStream,
    getTrace: async () => {
      const usage = await result.usage;
      const text = await result.text;
      return finalizeTrace(partial, {
        output: text,
        inputTokens: usage.inputTokens ?? 0,
        outputTokens: usage.outputTokens ?? 0,
      });
    },
  };
}
