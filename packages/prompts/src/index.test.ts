/**
 * @spec docs/specs/P0.A-4-vitest-baseline.md
 * Smoke test — P0.B-2 会用真实的 prompt 常量 + parser 测试替换本文件。
 */
import { describe, expect, it } from "vitest";

describe("@aiclassroom/prompts — smoke", () => {
  it("1 + 1 = 2", () => {
    expect(1 + 1).toBe(2);
  });
});
