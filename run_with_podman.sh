#!/bin/bash
# Script to run Podnex with MongoDB using Podman

# Define pods, containers and images
POD_NAME="podnex-pod"
MONGODB_CONTAINER="podnex-mongodb"
APP_CONTAINER="podnex-app"
APP_IMAGE="podnex-app:latest"
MONGODB_IMAGE="mongo:latest"

# JWT Secret management
JWT_SECRET_FILE=".jwt_secret"
JWT_ROTATION_FILE=".jwt_rotation"

# Check if we need to rotate the JWT secret (weekly rotation)
rotate_jwt_secret() {
  if [ ! -f "$JWT_ROTATION_FILE" ]; then
    # First time setup - create rotation timestamp
    date +%s > "$JWT_ROTATION_FILE"
    return 0
  else
    current_time=$(date +%s)
    last_rotation=$(cat "$JWT_ROTATION_FILE")
    # 604800 seconds = 1 week
    if [ $((current_time - last_rotation)) -ge 604800 ]; then
      echo "JWT secret is over a week old. Rotating..."
      date +%s > "$JWT_ROTATION_FILE"
      return 0
    fi
  fi
  return 1
}

# Generate or retrieve JWT secret
get_jwt_secret() {
  if [ ! -f "$JWT_SECRET_FILE" ] || rotate_jwt_secret; then
    echo "Generating new JWT secret..."
    openssl rand -base64 64 | tr -d '\n' > "$JWT_SECRET_FILE"
    chmod 600 "$JWT_SECRET_FILE"  # Secure the file with restrictive permissions
  fi
  
  cat "$JWT_SECRET_FILE"
}

# Function to check if an image exists
image_exists() {
  podman image exists "$1"
  return $?
}

# Function to check if a container exists (running or not)
container_exists() {
  podman container exists "$1" >/dev/null 2>&1
  return $?
}

# Function to check if a pod exists
pod_exists() {
  podman pod exists "$1" >/dev/null 2>&1
  return $?
}

# Function to check if a container is running
container_running() {
  [ "$(podman container inspect --format='{{.State.Running}}' "$1" 2>/dev/null)" = "true" ]
  return $?
}

# Clean up all existing containers, pods, and images if requested
echo "Checking for existing Podnex containers and pods..."

# Remove existing pod if it exists (this will also remove the containers in it)
if pod_exists "$POD_NAME"; then
  echo "Found existing $POD_NAME pod. Stopping and removing it..."
  podman pod stop "$POD_NAME" >/dev/null 2>&1
  podman pod rm "$POD_NAME" >/dev/null 2>&1
  echo "$POD_NAME pod and its containers removed."
else
  # Individual container cleanup in case they exist outside of pod
  # Stop and remove existing app container if it exists
  if container_exists "$APP_CONTAINER"; then
    echo "Found existing $APP_CONTAINER container. Stopping and removing it..."
    podman stop "$APP_CONTAINER" >/dev/null 2>&1
    podman rm "$APP_CONTAINER" >/dev/null 2>&1
    echo "$APP_CONTAINER container removed."
  fi

  # Stop and remove existing MongoDB container if it exists
  if container_exists "$MONGODB_CONTAINER"; then
    echo "Found existing $MONGODB_CONTAINER container. Stopping and removing it..."
    podman stop "$MONGODB_CONTAINER" >/dev/null 2>&1
    podman rm "$MONGODB_CONTAINER" >/dev/null 2>&1
    echo "$MONGODB_CONTAINER container removed."
  fi
fi

# Remove existing app image if it exists
if image_exists "$APP_IMAGE"; then
  echo "Found existing $APP_IMAGE image. Removing it..."
  podman rmi "$APP_IMAGE" >/dev/null 2>&1
  echo "$APP_IMAGE image removed."
fi

# Create named volumes for MongoDB data persistence only if they don't exist
echo "Checking for MongoDB data volumes..."
if ! podman volume inspect mongodb_data >/dev/null 2>&1; then
  echo "Creating mongodb_data volume..."
  podman volume create mongodb_data
else
  echo "mongodb_data volume already exists."
fi

if ! podman volume inspect mongodb_config >/dev/null 2>&1; then
  echo "Creating mongodb_config volume..."
  podman volume create mongodb_config
else
  echo "mongodb_config volume already exists."
fi

# Pull MongoDB image
echo "Pulling latest MongoDB image..."
podman pull $MONGODB_IMAGE

# Create the pod
echo "Creating the Podnex pod..."
podman pod create --name $POD_NAME -p 27017:27017 -p 5000:5000

# Start MongoDB container in the pod
echo "Starting MongoDB container in the pod..."
podman run -d \
  --pod $POD_NAME \
  --name $MONGODB_CONTAINER \
  -e MONGO_INITDB_ROOT_USERNAME=podnex_admin \
  -e MONGO_INITDB_ROOT_PASSWORD=podnex_secure_password \
  -e MONGO_INITDB_DATABASE=podnex \
  -v mongodb_data:/data/db \
  -v mongodb_config:/data/configdb \
  $MONGODB_IMAGE

# Wait for MongoDB to start up properly
echo "MongoDB to initializing..."

# Build the Podnex application with detailed build logs
echo "Building Podnex full-stack application (client + server) with Node.js 20..."
podman build --progress=plain -t $APP_IMAGE -f Dockerfile . || {
  echo "Build failed. Check the errors above."
  exit 1
}

# Verify the content of the image to ensure client files were properly copied
echo "Verifying container image contents..."
echo "Checking if client files are properly included:"
podman run --rm $APP_IMAGE ls -la /app/server/public || {
  echo "WARNING: Public directory not found or empty!"
  echo "The React client may not be properly built or included."
}

# Get or generate JWT secret with weekly rotation
JWT_SECRET=$(get_jwt_secret)
echo "Using JWT secret from $JWT_SECRET_FILE (rotated weekly)"

# Run the Podnex application container in the same pod
echo "Starting Podnex application container in the pod..."
podman run -d \
  --pod $POD_NAME \
  --name $APP_CONTAINER \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e MONGO_URI="mongodb://podnex_admin:podnex_secure_password@localhost:27017/podnex?authSource=admin" \
  -e JWT_SECRET="$JWT_SECRET" \
  -e JWT_EXPIRE="30d" \
  $APP_IMAGE

echo "Checking if Podnex application started correctly..."
sleep 5
podman logs $APP_CONTAINER

echo "Podnex application (client & server) is now running in a pod!"
echo "- MongoDB is available at localhost:27017"
echo "- Podnex application is available at http://localhost:5000"
echo
echo "To see pod status: podman pod ps"
echo "To see application logs: podman logs $APP_CONTAINER"
echo "To see MongoDB logs: podman logs $MONGODB_CONTAINER"
echo "To check client files in container: podman exec $APP_CONTAINER ls -la /app/server/public"
echo "To check Node.js version: podman exec $APP_CONTAINER node --version"