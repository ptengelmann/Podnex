# Multi-stage Dockerfile for Podnex application

# ============================================================
# Stage 1: Build the React frontend (client image)
# ============================================================
FROM node:20 AS podnex-client

WORKDIR /app

# Copy client package files
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy client source code
COPY client/ ./

# Build the React app
RUN npm run build

# Expose port for the client dev server
EXPOSE 3000

# Command to run the client application
CMD ["npm", "start"]

# ============================================================
# Stage 2: Set up the Express backend (server image)
# ============================================================
FROM node:20 AS server-builder

WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy server source code
COPY server/ ./

# Create public directory if it doesn't exist
RUN mkdir -p ./public

# ============================================================
# Stage 3: Final production image for server
# ============================================================
FROM node:20-alpine AS podnex-server

# Create app directory
WORKDIR /app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy server from server-builder stage
COPY --from=server-builder /app/server /app/server
# Copy .env file for server environment variables
COPY server/.env /app/server/.env
# Explicitly create the public directory
RUN mkdir -p /app/server/public

# Copy built client files from podnex-client stage to the server's public directory
COPY --from=podnex-client /app/build/ /app/server/public/

# List the contents to verify files are copied correctly
RUN ls -la /app/server/public/

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

# Set working directory to server
WORKDIR /app/server

# Expose port for the backend service
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "server.js"]

# ============================================================
# Development image for Podnex client and server
# ============================================================
FROM node:20-slim AS dev-base

WORKDIR /workspace

# Install basic dev tools and network tools
RUN apt-get update && apt-get install -y git vim nano curl iproute2 iputils-ping net-tools dnsutils procps psmisc && rm -rf /var/lib/apt/lists/*

# Default: do not copy any code, expect code to be mounted at /workspace

# Optionally, install global tools here (e.g., nodemon, yarn)
# RUN npm install -g nodemon