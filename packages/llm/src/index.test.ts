/**
 * @spec docs/specs/P0.A-4-vitest-baseline.md
 * Smoke test — P0.B-3 会用 resolveModel / generateStructured / stream 的真实测试替换本文件。
 */
import { describe, expect, it } from "vitest";

describe("@aiclassroom/llm — smoke", () => {
  it("1 + 1 = 2", () => {
    expect(1 + 1).toBe(2);
  });
});
