/** @spec docs/specs/P0.B-3-llm-sdk-wrapper.md */

/** LLM 模型配置 */
export interface ModelConfig {
  provider: "anthropic" | "openai" | "google" | "deepseek" | "openai-compatible";
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

/** 按用途的默认模型配置（见 tech-stack.md § 4.3） */
export const DEFAULT_CONFIGS = {
  outline: { provider: "anthropic", model: "claude-opus-4-6" },
  scene: { provider: "anthropic", model: "claude-sonnet-4-6" },
  chat: { provider: "anthropic", model: "claude-sonnet-4-6" },
  grade: { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
} as const satisfies Record<string, ModelConfig>;
