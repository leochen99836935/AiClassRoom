/**
 * @spec docs/specs/P0.A-4-vitest-baseline.md
 * 根级 Vitest 配置。6 个 packages 子包跑 `vitest run` 时会向上找到这份 config。
 * DOM 环境（jsdom）+ Testing Library 由 P0.C-1 Next.js bootstrap 时另建。
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    passWithNoTests: false,
    clearMocks: true,
    restoreMocks: true,
  },
});
