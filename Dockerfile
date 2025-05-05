# Multi-stage Dockerfile for Podnex application

# ============================================================
# Stage 1: Build the React frontend
# ============================================================
FROM node:20 AS client-builder

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy client source code
COPY client/ ./

# Build the React app
RUN npm run build

# ============================================================
# Stage 2: Set up the Express backend
# ============================================================
FROM node:20 AS server-builder

WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy server source code
COPY server/ ./

# ============================================================
# Stage 3: Final production image
# ============================================================
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy server from server-builder stage
COPY --from=server-builder /app/server /app/server

# Copy built client files from client-builder stage to the server's public directory
COPY --from=client-builder /app/client/build /app/server/public

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