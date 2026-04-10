/**
 * @spec docs/specs/P0.B-2-prompts-convention.md
 */
import { describe, expect, it } from "vitest";

import { helloPrompt } from "./index";

describe("@aiclassroom/prompts — hello prompt", () => {
  it("has a valid semver version", () => {
    expect(helloPrompt.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("template contains {{topic}} placeholder", () => {
    expect(helloPrompt.template).toContain("{{topic}}");
  });

  it("render replaces {{topic}} with the given value", () => {
    const result = helloPrompt.render({ topic: "AI" });
    expect(result).toContain("AI");
    expect(result).not.toContain("{{topic}}");
  });

  it("render preserves the rest of the template", () => {
    const result = helloPrompt.render({ topic: "machine learning" });
    expect(result).toContain("helpful AI teaching assistant");
    expect(result).toContain("machine learning");
  });
});
