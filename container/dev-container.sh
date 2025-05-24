#!/usr/bin/env bash
# dev-container.sh: Start a development container for Podnex client or server with local code mounted
# Usage: ./dev-container.sh [client|server] [podman|docker]

set -e

SERVICE="${1:-server}"
ENGINE="${2:-podman}"

if [[ "$SERVICE" != "client" && "$SERVICE" != "server" ]]; then
  echo "Usage: $0 [client|server] [podman|docker]"
  exit 1
fi

IMAGE="dev-base"
CONTAINER_NAME="podnex-dev-$SERVICE"

# Set the working directory and port
if [[ "$SERVICE" == "client" ]]; then
  SRC_DIR="$(pwd)/client"
  PORT=3000
  CMD="npm start"
else
  SRC_DIR="$(pwd)/server"
  PORT=5000
  CMD="npm run dev || node server.js"
fi

# Remove any existing container
$ENGINE rm -f "$CONTAINER_NAME" 2>/dev/null || true

# Start the container with code mounted (detached mode)
$ENGINE run -d --name "$CONTAINER_NAME" \
  -v "$SRC_DIR":/app:Z \
  -w /app \
  -p $PORT:$PORT \
  $IMAGE bash -c "$CMD"
