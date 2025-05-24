#!/usr/bin/env bash
# podnex-stop.sh: Stop and remove Podnex containers/pod/network
# Usage: ./podnex-stop.sh [podman|docker]

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

# Helper: check if pod exists (podman)
pod_exists() { $ENGINE pod exists "$POD_NAME" 2>/dev/null; }

# Helper: check if container exists (docker)
container_exists() { $ENGINE container inspect "$1" >/dev/null 2>&1; }

# Helper: check if network exists (docker)
network_exists() { $ENGINE network inspect "$NETWORK" >/dev/null 2>&1; }

if [[ "$ENGINE" == "podman" ]]; then
  if pod_exists; then
    yellow "[!] Stopping and removing pod $POD_NAME..."
    $ENGINE pod stop "$POD_NAME" || true
    $ENGINE pod rm "$POD_NAME" || true
    green "[✓] Pod $POD_NAME stopped and removed."
  else
    yellow "[!] Pod $POD_NAME does not exist."
  fi
else
  for c in "$CLIENT_CONTAINER" "$SERVER_CONTAINER" "$MONGO_CONTAINER"; do
    if container_exists "$c"; then
      yellow "[!] Stopping and removing container $c..."
      $ENGINE stop "$c" || true
      $ENGINE rm "$c" || true
      green "[✓] Container $c stopped and removed."
    fi
  done
  if network_exists; then
    yellow "[!] Removing network $NETWORK..."
    $ENGINE network rm "$NETWORK"
    green "[✓] Network $NETWORK removed."
  fi
fi
