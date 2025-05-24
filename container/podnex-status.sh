#!/usr/bin/env bash
# podnex-status.sh: Show status of Podnex containers/pod/network
# Usage: ./podnex-status.sh [podman|docker]

set -e

ENGINE=${1:-podman}

POD_NAME="podnex-pod"
MONGO_CONTAINER="podnex-mongodb"
SERVER_CONTAINER="podnex-app"
CLIENT_CONTAINER="podnex-client"
NETWORK="podnex-net"

# Color functions
green() { echo -e "\033[1;32m$1\033[0m"; }
yellow() { echo -e "\033[1;33m$1\033[0m"; }
red() { echo -e "\033[1;31m$1\033[0m"; }

if [[ "$ENGINE" == "podman" ]]; then
  yellow "[i] Pod status:"
  podman pod ps
  yellow "[i] Container status:"
  podman ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
  yellow "[i] Container status:"
  docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
  yellow "[i] Network status:"
  docker network ls | grep "$NETWORK" || green "[✓] Network $NETWORK not present."
fi
