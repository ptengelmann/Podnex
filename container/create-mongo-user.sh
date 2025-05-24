#!/usr/bin/env bash
# create-mongo-user.sh: Create podnex_admin user in MongoDB if not exists
# Usage: ./create-mongo-user.sh [container_name]

set -e
CONTAINER="${1:-podnex-mongodb}"
USER="podnex_admin"
PASS="podnex_secure_password"
DB="admin"

# Try to check if user exists using authentication
USER_EXISTS=$(podman exec "$CONTAINER" mongosh --quiet -u "$USER" -p "$PASS" --authenticationDatabase "$DB" --eval "db.getSiblingDB('$DB').getUser('$USER') !== null" 2>/dev/null || echo "false")

if [[ "$USER_EXISTS" == "true" ]]; then
  echo "[✗] MongoDB user $USER already exists in $DB. Aborting."
  exit 1
else
  echo "[+] Creating MongoDB user $USER in $DB..."
  podman exec "$CONTAINER" mongosh --eval "db.getSiblingDB('$DB').createUser({user: '$USER', pwd: '$PASS', roles: [{role: 'root', db: '$DB'}]})"
  echo "[✓] User $USER created."
fi
