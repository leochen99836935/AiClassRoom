/** @spec docs/specs/P0.B-2-prompts-convention.md */

import type { PromptDef } from "./types";

const template =
  "You are a helpful AI teaching assistant. The user wants to learn about {{topic}}. Say hello and briefly introduce the topic in 2-3 sentences.";

/** Hello Claude 烟囱用的示例 prompt（P0.C-4） */
export const helloPrompt: PromptDef<{ topic: string }> = {
  version: "1.0.0",
  name: "hello",
  template,
  render: (vars) => template.replace("{{topic}}", vars.topic),
};
