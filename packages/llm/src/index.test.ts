/**
 * @spec docs/specs/P0.B-3-llm-sdk-wrapper.md
 * 类型 + trace 逻辑测试（不真实调用 LLM）
 */
import { describe, expect, it } from "vitest";

import type { TraceRecord } from "@aiclassroom/types";
import { DEFAULT_CONFIGS, resolveModel, createTrace, finalizeTrace } from "./index";
import type { ModelConfig } from "./config";

describe("@aiclassroom/llm", () => {
  it("DEFAULT_CONFIGS has all 4 presets", () => {
    expect(DEFAULT_CONFIGS.outline.provider).toBe("anthropic");
    expect(DEFAULT_CONFIGS.scene.model).toBe("claude-sonnet-4-6");
    expect(DEFAULT_CONFIGS.chat.model).toBe("claude-sonnet-4-6");
    expect(DEFAULT_CONFIGS.grade.model).toBe("claude-haiku-4-5-20251001");
  });

  it("resolveModel returns a LanguageModel for anthropic", () => {
    const cfg: ModelConfig = {
      provider: "anthropic",
      model: "claude-sonnet-4-6",
      apiKey: "test-key",
    };
    const model = resolveModel(cfg);
    expect(model).toBeDefined();
    // modelId exists at runtime but LanguageModel union type doesn't expose it
    expect((model as unknown as { modelId: string }).modelId).toBe("claude-sonnet-4-6");
  });

  it("resolveModel returns a LanguageModel for openai", () => {
    const cfg: ModelConfig = {
      provider: "openai",
      model: "gpt-4o",
      apiKey: "test-key",
    };
    const model = resolveModel(cfg);
    expect(model).toBeDefined();
    expect((model as unknown as { modelId: string }).modelId).toBe("gpt-4o");
  });

  it("resolveModel throws for openai-compatible without baseUrl", () => {
    const cfg: ModelConfig = {
      provider: "openai-compatible",
      model: "local-model",
    };
    expect(() => resolveModel(cfg)).toThrow("baseUrl");
  });

  it("createTrace + finalizeTrace produce valid TraceRecord shape", () => {
    const cfg: ModelConfig = {
      provider: "anthropic",
      model: "claude-sonnet-4-6",
    };
    const partial = createTrace(cfg, "outline_agent", "draft", {
      prompt: "test",
    });

    expect(partial.provider).toBe("anthropic");
    expect(partial.agent).toBe("outline_agent");
    expect(partial.startedAt).toBeTruthy();

    const trace = finalizeTrace(partial, {
      output: { text: "hello" },
      inputTokens: 100,
      outputTokens: 50,
    });

    // Verify it matches TraceRecord shape (minus id/lessonId)
    const _typeCheck: Omit<TraceRecord, "id" | "lessonId"> = trace;
    expect(_typeCheck.latencyMs).toBeGreaterThanOrEqual(0);
    expect(trace.finishedAt).toBeTruthy();
    expect(trace.inputTokens).toBe(100);
    expect(trace.outputTokens).toBe(50);
    expect(trace.error).toBeUndefined();
  });

  it("finalizeTrace includes error when provided", () => {
    const cfg: ModelConfig = {
      provider: "anthropic",
      model: "claude-sonnet-4-6",
    };
    const partial = createTrace(cfg, "scene_agent", "generate", {});
    const trace = finalizeTrace(partial, {
      output: null,
      inputTokens: 0,
      outputTokens: 0,
      error: { message: "timeout" },
    });

    expect(trace.error).toEqual({ message: "timeout" });
  });
});
