#!/usr/bin/env bash
# start-dev-vscode-container.sh: Start a full-featured dev container for VS Code remote attach
# Usage: ./start-dev-vscode-container.sh [podman|docker]

set -e
ENGINE="${1:-podman}"
IMAGE="dev-base"
CONTAINER_NAME="podnex-dev-vscode"
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Build the dev-base image if it doesn't exist or needs updating
$ENGINE build -t "$IMAGE" -f "$PROJECT_ROOT/Dockerfile" --target dev-base "$PROJECT_ROOT"

# Ensure podnex-net network exists
if ! $ENGINE network inspect podnex-net >/dev/null 2>&1; then
  $ENGINE network create podnex-net
fi

# Remove any existing container
$ENGINE rm -f "$CONTAINER_NAME" 2>/dev/null || true

# Set extra capabilities for podman
EXTRA_CAPS=""
if [[ "$ENGINE" == "podman" ]]; then
  EXTRA_CAPS="--cap-add=CAP_NET_RAW"
fi

HOSTNAME_OPT="--hostname $CONTAINER_NAME"
# Start the container in detached mode with the full project mounted and on podnex-net
RUN_CMD="$ENGINE run -d --name \"$CONTAINER_NAME\" --network podnex-net $EXTRA_CAPS $HOSTNAME_OPT -v \"$PROJECT_ROOT\":/workspace:Z -w /workspace -p 13000:3000 -p 15000:5000 $IMAGE bash -c \"sleep infinity\""
echo "$RUN_CMD"

eval $RUN_CMD
