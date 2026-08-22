#!/usr/bin/env bash
# One entrypoint for "is this working-tree state green" — run identically
# by developers/agents locally and by CI. Runs lint+build+test for every
# workspace package (or a single one via --filter).
#
# Usage:
#   scripts/verify.sh              # verify all workspace packages
#   scripts/verify.sh --filter web # verify only the given package

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Karma needs a Chrome/Chromium binary; auto-detect if not already set so this
# runs out of the box both locally and in CI without extra setup.
if [ -z "${CHROME_BIN:-}" ]; then
  for candidate in google-chrome-stable google-chrome chromium chromium-browser; do
    if command -v "$candidate" >/dev/null 2>&1; then
      export CHROME_BIN
      CHROME_BIN="$(command -v "$candidate")"
      break
    fi
  done
fi

FILTER="${2:-}"
if [ "${1:-}" = "--filter" ]; then
  PNPM_FILTER=(--filter "$FILTER")
else
  PNPM_FILTER=()
fi

run() {
  echo "▶ $*"
  "$@"
}

run pnpm install --frozen-lockfile

run pnpm "${PNPM_FILTER[@]}" -r run build
run pnpm "${PNPM_FILTER[@]}" -r run lint
run pnpm "${PNPM_FILTER[@]}" -r run test

# sck-admin-app has its own build/lint/test scripts (build:admin etc.)
# rather than being folded into web's plain build/lint/test - that script
# stays sck-app-only since it's also what the "web" Docker image build
# calls, and that image has no business depending on sck-admin-app too.
if [ -z "$FILTER" ] || [ "$FILTER" = "web" ]; then
  run pnpm --filter web run build:admin
  run pnpm --filter web run lint:admin
  run pnpm --filter web run test:admin
fi

echo "✔ verify passed"
