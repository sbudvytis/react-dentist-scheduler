# Start from the updated base image
FROM --platform=linux/amd64 node:18.19.0-alpine3.18 AS builder

WORKDIR /app

COPY ../package*.json .
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm ci

# Copy over the server source code
COPY server/ server/

# Build the server
WORKDIR /app/server
RUN npm run build

EXPOSE 3000

# Default command
CMD ["npm", "run", "start"]
