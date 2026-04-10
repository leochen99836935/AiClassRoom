/** @spec docs/specs/P0.B-1-domain-types.md */

import type { Id, ISODateString } from "./common";

/** 一次 LLM 调用的追踪记录 */
export interface TraceRecord {
  id: Id;
  lessonId?: Id;
  agent: string;
  node: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  costUsd?: number;
  startedAt: ISODateString;
  finishedAt: ISODateString;
  input: unknown;
  output: unknown;
  error?: { message: string; stack?: string };
}
