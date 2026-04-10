/**
 * @spec docs/specs/P0.A-4-vitest-baseline.md
 * Smoke test — P0.B-4 会用真实的 shadcn 组件 + Testing Library 测试替换本文件。
 */
import { describe, expect, it } from "vitest";

describe("@aiclassroom/ui — smoke", () => {
  it("1 + 1 = 2", () => {
    expect(1 + 1).toBe(2);
  });
});
