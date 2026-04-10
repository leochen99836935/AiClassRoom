/** @spec docs/specs/P0.C-2-env-and-settings.md */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Server-only env (API keys — never exposed to client bundle)
// ---------------------------------------------------------------------------
const serverEnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  DEEPSEEK_API_KEY: z.string().optional(),
  LOCAL_LLM_BASE_URL: z.string().url().optional(),
  LOCAL_LLM_API_KEY: z.string().optional(),
  OPENAI_TTS_KEY: z.string().optional(),
  MINIMAX_API_KEY: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Client env (NEXT_PUBLIC_* — available everywhere)
// ---------------------------------------------------------------------------
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("AIClassRoom"),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(["zh-CN", "en-US"]).default("zh-CN"),
});

// ---------------------------------------------------------------------------
// Parse & export
// ---------------------------------------------------------------------------

function parseServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error("[env] Server env validation failed:", result.error.flatten().fieldErrors);
    throw new Error("[env] Invalid server environment variables");
  }
  return result.data;
}

function parseClientEnv() {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_NAME: process.env["NEXT_PUBLIC_APP_NAME"],
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env["NEXT_PUBLIC_DEFAULT_LOCALE"],
  });
  if (!result.success) {
    console.error("[env] Client env validation failed:", result.error.flatten().fieldErrors);
    throw new Error("[env] Invalid client environment variables");
  }
  return result.data;
}

/** Server-only env — import only in server code / route handlers */
export const serverEnv = typeof window === "undefined" ? parseServerEnv() : ({} as never);

/** Client env — safe to use everywhere */
export const clientEnv = parseClientEnv();

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
