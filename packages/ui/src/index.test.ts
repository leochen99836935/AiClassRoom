/**
 * @spec docs/specs/P0.B-4-ui-kit.md
 */
import { describe, expect, it } from "vitest";

import { cn } from "./lib/utils";

describe("@aiclassroom/ui", () => {
  it("cn merges class names correctly", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("cn deduplicates tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("cn handles falsy values", () => {
    const isHidden = false as boolean;
    expect(cn("base", isHidden && "hidden", "visible")).toBe("base visible");
  });

  it("exports all 6 components", async () => {
    const ui = await import("./index");
    expect(ui.Button).toBeDefined();
    expect(ui.Input).toBeDefined();
    expect(ui.Dialog).toBeDefined();
    expect(ui.Popover).toBeDefined();
    expect(ui.Tabs).toBeDefined();
    expect(ui.Toast).toBeDefined();
  });
});
