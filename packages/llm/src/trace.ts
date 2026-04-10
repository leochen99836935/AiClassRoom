/** @spec docs/specs/P0.B-3-llm-sdk-wrapper.md */

import type { TraceRecord } from "@aiclassroom/types";
import type { ModelConfig } from "./config";

/** 创建一条未完成的 trace（调用前） */
export function createTrace(
  cfg: ModelConfig,
  agent: string,
  node: string,
  input: unknown,
): Pick<TraceRecord, "provider" | "model" | "agent" | "node" | "input" | "startedAt"> & {
  _startMs: number;
} {
  return {
    provider: cfg.provider,
    model: cfg.model,
    agent,
    node,
    input,
    startedAt: new Date().toISOString(),
    _startMs: Date.now(),
  };
}

/** 补全一条 trace（调用后） */
export function finalizeTrace(
  partial: ReturnType<typeof createTrace>,
  result: {
    output: unknown;
    inputTokens: number;
    outputTokens: number;
    error?: { message: string; stack?: string };
  },
): Omit<TraceRecord, "id" | "lessonId"> {
  const now = Date.now();
  return {
    provider: partial.provider,
    model: partial.model,
    agent: partial.agent,
    node: partial.node,
    input: partial.input,
    output: result.output,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
    latencyMs: now - partial._startMs,
    startedAt: partial.startedAt,
    finishedAt: new Date(now).toISOString(),
    ...(result.error ? { error: result.error } : {}),
  };
}
