/**
 * @spec docs/specs/P0.A-4-vitest-baseline.md
 * Smoke test — P0.B-1 会用 data-model.md 的完整领域类型替换本文件。
 */
import { describe, expect, it } from "vitest";

import type { Placeholder } from "./index";

describe("@aiclassroom/types — placeholder", () => {
  it("Placeholder type can be brand-narrowed", () => {
    const value = { _brand: "placeholder" } as const satisfies Placeholder;
    expect(value._brand).toBe("placeholder");
  });
});
