/** @spec docs/specs/P0.B-3-llm-sdk-wrapper.md */

import { type LanguageModel } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

import type { ModelConfig } from "./config";

/** 根据配置构造 Vercel AI SDK 的 LanguageModel 实例 */
export function resolveModel(cfg: ModelConfig): LanguageModel {
  const keyOpts = cfg.apiKey ? { apiKey: cfg.apiKey } : {};

  switch (cfg.provider) {
    case "anthropic": {
      const provider = createAnthropic(keyOpts);
      return provider(cfg.model);
    }
    case "openai": {
      const provider = createOpenAI(keyOpts);
      return provider(cfg.model);
    }
    case "google": {
      const provider = createGoogleGenerativeAI(keyOpts);
      return provider(cfg.model);
    }
    case "deepseek": {
      const provider = createDeepSeek(keyOpts);
      return provider(cfg.model);
    }
    case "openai-compatible": {
      if (!cfg.baseUrl) {
        throw new Error("openai-compatible provider requires baseUrl");
      }
      const provider = createOpenAICompatible({
        name: "custom",
        baseURL: cfg.baseUrl,
        ...keyOpts,
      });
      return provider(cfg.model);
    }
    default: {
      const _exhaustive: never = cfg.provider;
      throw new Error(`Unknown provider: ${String(_exhaustive)}`);
    }
  }
}
