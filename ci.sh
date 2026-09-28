#!/bin/bash
set -e # Exit on any error

echo "Installing/updating dependencies (if needed)..."
if [ ! -x node_modules/.bin/eslint ] || [ ! -x node_modules/.bin/vitest ]; then
  npm ci --no-audit --no-fund
else
  echo "eslint and vitest binaries present; skipping npm install"
fi

npm run lint
npm run format:check
npm run typecheck
npm run test -- --run
npm run build

echo "✅ All CI checks passed!"
