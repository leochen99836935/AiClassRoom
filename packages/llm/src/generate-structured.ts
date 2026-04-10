/** @spec docs/specs/P0.B-3-llm-sdk-wrapper.md */

import { generateObject } from "ai";
import type { z } from "zod";

import type { TraceRecord } from "@aiclassroom/types";
import type { ModelConfig } from "./config";
import { resolveModel } from "./resolve-model";
import { createTrace, finalizeTrace } from "./trace";

export interface GenerateStructuredOptions<T extends z.ZodType> {
  schema: T;
  prompt: string;
  cfg: ModelConfig;
  agent?: string;
  node?: string;
}

export interface GenerateStructuredResult<T> {
  data: T;
  trace: Omit<TraceRecord, "id" | "lessonId">;
}

/** 调用 LLM 生成结构化 JSON，自动产出 trace */
export async function generateStructured<T extends z.ZodType>(
  opts: GenerateStructuredOptions<T>,
): Promise<GenerateStructuredResult<z.infer<T>>> {
  const model = resolveModel(opts.cfg);
  const partial = createTrace(opts.cfg, opts.agent ?? "unknown", opts.node ?? "direct", {
    prompt: opts.prompt,
  });

  try {
    const result = await generateObject({
      model,
      schema: opts.schema,
      prompt: opts.prompt,
    });

    const trace = finalizeTrace(partial, {
      output: result.object as unknown,
      inputTokens: result.usage.inputTokens ?? 0,
      outputTokens: result.usage.outputTokens ?? 0,
    });

    return { data: result.object as z.infer<T>, trace };
  } catch (err) {
    const error =
      err instanceof Error
        ? { message: err.message, ...(err.stack ? { stack: err.stack } : {}) }
        : { message: String(err) };

    const trace = finalizeTrace(partial, {
      output: null,
      inputTokens: 0,
      outputTokens: 0,
      error,
    });

    throw Object.assign(err instanceof Error ? err : new Error(String(err)), {
      trace,
    });
  }
}
