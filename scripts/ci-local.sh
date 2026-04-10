#!/usr/bin/env bash
# @spec docs/specs/P0.C-6-local-ci.md
# Local CI — run before pushing to ensure quality.
set -euo pipefail

echo "=== [1/5] Format check ==="
pnpm format:check

echo "=== [2/5] Lint ==="
pnpm -r lint

echo "=== [3/5] Typecheck ==="
pnpm -r typecheck

echo "=== [4/5] Test ==="
pnpm -r test

echo "=== [5/5] Build ==="
pnpm --filter web build

echo ""
echo "=== All checks passed ==="
