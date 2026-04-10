# Prompt 文件约定

> 本文件是 `packages/prompts/` 的开发约定。新增 prompt 前请先阅读。

## 规则

1. **一个 prompt 一个文件**：文件名 = prompt 名，kebab-case（如 `outline-draft.ts`）
2. **统一导出格式**：每个文件导出一个 `PromptDef` 常量，命名为 `xxxPrompt`（如 `outlineDraftPrompt`）
3. **版本管理**：`version` 遵循语义化版本
   - patch（0.0.x）：改措辞、修 typo
   - minor（0.x.0）：改结构（增减变量、调整段落）
   - major（x.0.0）：改意图（用途变化、输出 schema 变化）
4. **变量占位**：用 `{{variable}}` 格式，`render` 函数做替换
5. **纯函数**：`render` 只做字符串替换，禁止 import 业务逻辑或产生副作用
6. **禁止内联**：业务代码中不允许内联长 prompt，必须放在本包中

## 示例

```ts
import type { PromptDef } from "./types";

const template = "Your prompt here with {{variable}}.";

export const myPrompt: PromptDef<{ variable: string }> = {
  version: "1.0.0",
  name: "my-prompt",
  template,
  render: (vars) => template.replace("{{variable}}", vars.variable),
};
```
