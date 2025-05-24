#!/usr/bin/env bash
# podnex-run.sh: Start Podnex stack (MongoDB, server, client) using podman or docker
# Usage: ./podnex-run.sh [podman|docker] [--restart|-r]

set -e

ENGINE="podman"
RESTART=0
for arg in "$@"; do
  case $arg in
    podman|docker)
      ENGINE="$arg";;
    --restart|-r)
      RESTART=1;;
  esac

done

# Color functions
green() { echo -e "\033[1;32m$1\033[0m"; }
yellow() { echo -e "\033[1;33m$1\033[0m"; }
red() { echo -e "\033[1;31m$1\033[0m"; }

# Names
POD_NAME="podnex-pod"
MONGO_CONTAINER="podnex-mongodb"
SERVER_CONTAINER="podnex-app"
CLIENT_CONTAINER="podnex-client"
NETWORK="podnex-net"

# Helper: check if running in WSL2
is_wsl() { grep -qi microsoft /proc/version 2>/dev/null; }

# Helper: check if pod exists (podman)
pod_exists() { $ENGINE pod exists "$POD_NAME" 2>/dev/null; }

# Helper: check if container exists (docker)
container_exists() { $ENGINE container inspect "$1" >/dev/null 2>&1; }

# Helper: check if network exists (docker)
network_exists() { $ENGINE network inspect "$NETWORK" >/dev/null 2>&1; }

# Stop and remove containers/pod/network if --restart
cleanup() {
  yellow "[!] Cleaning up existing containers/pod/network..."
  # Always try to remove containers by name, even if not in pod
  for c in "$CLIENT_CONTAINER" "$SERVER_CONTAINER" "$MONGO_CONTAINER"; do
    if $ENGINE container exists "$c" 2>/dev/null; then
      yellow "[!] Removing container $c..."
      $ENGINE rm -f "$c" || true
    fi
  done
  if [[ "$ENGINE" == "podman" ]]; then
    if pod_exists; then
      $ENGINE pod stop "$POD_NAME" || true
      $ENGINE pod rm "$POD_NAME" || true
    fi
  fi
}

# Start MongoDB, server, client
start_podman() {
  # Ensure network exists (for podman, network is optional but we want consistency)
  if ! $ENGINE network exists "$NETWORK" 2>/dev/null; then
    green "[+] Creating network $NETWORK..."
    $ENGINE network create "$NETWORK"
  else
    yellow "[!] Network $NETWORK already exists.No action needed."
  fi
  if ! pod_exists; then
    green "[+] Creating pod $POD_NAME..."
    $ENGINE pod create --name "$POD_NAME" -p 27017:27017 -p 5000:5000 -p 3001:3000 --network $NETWORK
  else
    yellow "[!] Pod $POD_NAME already exists. Use --restart to recreate."
    if [[ $RESTART -eq 0 ]]; then exit 1; fi
  fi
  green "[+] Starting MongoDB..."
  ./start-mongo-container.sh "$ENGINE" "$POD_NAME" "$MONGO_CONTAINER" "$NETWORK"
  green "[+] Ensuring MongoDB user exists..."
  ./create-mongo-user.sh "$MONGO_CONTAINER" || true
  green "[+] Starting server..."
  $ENGINE run -d --pod "$POD_NAME" --network "$NETWORK" --name "$SERVER_CONTAINER" \
    -e HOST=0.0.0.0 \
    podnex-server:latest
  green "[+] Starting client..."
  $ENGINE run -d --pod "$POD_NAME" --network "$NETWORK" --name "$CLIENT_CONTAINER" podnex-client:latest
}

start_docker() {
  if ! network_exists; then
    green "[+] Creating network $NETWORK..."
    $ENGINE network create "$NETWORK"
  else
    yellow "[!] Network $NETWORK already exists."No action needed.
  fi
  green "[+] Starting MongoDB..."
  ./start-mongo-container.sh "$ENGINE" docker "" "$MONGO_CONTAINER" "$NETWORK"
  green "[+] Starting server..."
  $ENGINE run -d --name "$SERVER_CONTAINER" --network "$NETWORK" -p 5000:5000 podnex-server:latest
  green "[+] Starting client..."
  $ENGINE run -d --name "$CLIENT_CONTAINER" --network "$NETWORK" -p 3001:3000 podnex-client:latest
}

main() {
  if [[ $RESTART -eq 1 ]]; then cleanup; fi
  if [[ "$ENGINE" == "podman" ]]; then
    start_podman
  elif [[ "$ENGINE" == "docker" ]]; then
    start_docker
  else
    red "[✗] Unknown engine: $ENGINE. Use 'podman' or 'docker'."
    exit 1
  fi
  green "[✓] Podnex stack started!"
  green "[i] MongoDB:    localhost:27017"
  green "[i] Server:     http://localhost:5000"
  green "[i] Client:     http://localhost:3001"
}

main
