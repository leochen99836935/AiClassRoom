/** @spec docs/specs/P0.B-3-llm-sdk-wrapper.md */

export type { ModelConfig } from "./config";
export { DEFAULT_CONFIGS } from "./config";
export { resolveModel } from "./resolve-model";
export {
  generateStructured,
  type GenerateStructuredOptions,
  type GenerateStructuredResult,
} from "./generate-structured";
export { stream, type StreamOptions, type StreamResult } from "./stream";
export { createTrace, finalizeTrace } from "./trace";
