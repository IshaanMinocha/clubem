#!/usr/bin/env sh
set -eu

# Automatically find project root (one level up from this script)
# Using a more portable way to find the script directory
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
PROJECT_ROOT=$(dirname "$SCRIPT_DIR")
cd "$PROJECT_ROOT"

# Optional: create folders early (safe if already exists)
mkdir -p data/uploads data/outputs data/jobs schema_registry/active schema_registry/history

export PYTHONPATH="$PROJECT_ROOT/src"

echo "Starting worker in background..."
poetry run python scripts/run_worker.py &
WORKER_PID=$!

cleanup() {
  echo "Stopping worker (pid=$WORKER_PID)..."
  kill "$WORKER_PID" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

echo "Starting Flask API..."
poetry run python scripts/run_flask_dev.py
