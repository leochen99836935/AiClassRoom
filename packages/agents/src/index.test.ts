/**
 * @spec docs/specs/P0.A-4-vitest-baseline.md
 * Smoke test — 未来会用 LangGraph agent 图结构 + 状态机测试替换本文件。
 */
import { describe, expect, it } from "vitest";

describe("@aiclassroom/agents — smoke", () => {
  it("1 + 1 = 2", () => {
    expect(1 + 1).toBe(2);
  });
});
