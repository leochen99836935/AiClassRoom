/** @spec docs/specs/P0.B-2-prompts-convention.md */

/** Prompt 定义的统一结构 */
export interface PromptDef<TVariables extends Record<string, string> = Record<string, string>> {
  /** 语义化版本号，如 "1.0.0" */
  version: string;
  /** prompt 名称 */
  name: string;
  /** prompt 模板字符串，用 {{variable}} 占位 */
  template: string;
  /** 渲染模板：将变量替换进 template */
  render: (vars: TVariables) => string;
}
