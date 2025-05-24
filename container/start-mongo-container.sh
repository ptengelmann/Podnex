#!/usr/bin/env bash
# start-mongo-container.sh: Start MongoDB container for Podnex stack
# Usage: ./start-mongo-container.sh [ENGINE] [POD_NAME or empty] [CONTAINER_NAME] [NETWORK]

set -e

readonly MONGO_IMAGE="mongo:latest"
readonly MONGO_PORT=27017
readonly MONGO_DB="podnex"
readonly MONGO_USER="podnex_admin"
readonly MONGO_PASS="podnex_secure_password"
readonly MONGO_HOSTNAME="host-mongodb"
readonly MONGO_DATA_VOLUME="podnex-mongo-data"
readonly MONGO_CONFIG_VOLUME="podnex-mongo-config"

# Common options
readonly MONGO_ENV_OPTS="
  -e MONGO_INITDB_ROOT_USERNAME=$MONGO_USER
  -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_PASS
  -e MONGO_INITDB_DATABASE=$MONGO_DB
"
readonly MONGO_PORT_OPT="-p $MONGO_PORT:$MONGO_PORT"
readonly MONGO_HOSTNAME_OPT="--hostname $MONGO_HOSTNAME"
readonly MONGO_VOLUME_OPTS="-v $MONGO_DATA_VOLUME:/data/db -v $MONGO_CONFIG_VOLUME:/data/configdb"

ENGINE="$1"
POD_OR_EMPTY="$2"
CONTAINER_NAME="$3"
NETWORK="$4"

# If POD_OR_EMPTY is empty, add --hostname host-mongodb
HOSTNAME_OPT=""
if [[ -z "$POD_OR_EMPTY" ]]; then
  HOSTNAME_OPT="--hostname $MONGO_HOSTNAME"
fi

if [[ "$ENGINE" == "podman" ]]; then
  if [[ -n "$POD_OR_EMPTY" ]]; then
    # Use pod if provided, do not set hostname or port
    CMD="$ENGINE run -d --pod \"$POD_OR_EMPTY\" --network \"$NETWORK\" --name \"$CONTAINER_NAME\" $MONGO_VOLUME_OPTS $MONGO_ENV_OPTS $MONGO_IMAGE"
    echo "$CMD"
    eval $CMD
  else
    # No pod, set hostname and port
    CMD="$ENGINE run -d --network \"$NETWORK\" $MONGO_HOSTNAME_OPT --name \"$CONTAINER_NAME\" $MONGO_VOLUME_OPTS $MONGO_ENV_OPTS $MONGO_PORT_OPT $MONGO_IMAGE"
    echo "$CMD"
    eval $CMD
  fi
elif [[ "$ENGINE" == "docker" ]]; then
  CMD="$ENGINE run -d $MONGO_HOSTNAME_OPT --name \"$CONTAINER_NAME\" --network \"$NETWORK\" $MONGO_VOLUME_OPTS $MONGO_ENV_OPTS $MONGO_PORT_OPT $MONGO_IMAGE"
  echo "$CMD"
  eval $CMD
else
  echo "Unknown engine: $ENGINE"
  exit 1
fi

# Ensure MongoDB user exists after container is started
if [[ -f "$(dirname "$0")/create-mongo-user.sh" ]]; then
  "$(dirname "$0")/create-mongo-user.sh" "$CONTAINER_NAME" || true
fi
