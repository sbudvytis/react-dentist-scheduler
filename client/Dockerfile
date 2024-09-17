# Stage 1: Build our front end
FROM --platform=linux/amd64 node:18.19.0-alpine3.18 AS builder

WORKDIR /app

# Copy package.json files and install dependencies
COPY ../package*.json .
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm ci

# Copy over the entire monorepo since we need to access the tRPC server
# types for the monorepo build.
COPY . .

ARG VITE_API_ORIGIN
ARG VITE_API_PATH

# Switch to the client folder
WORKDIR /app/client

# Build the client (HTML, CSS, JS, ...)
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM --platform=linux/amd64 nginx:1.25.3-alpine3.18

# Delete the default welcome page.
RUN rm /usr/share/nginx/html/* -rf

# Copy the built client app assets to the Nginx directory
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Copy the logo.png file to the appropriate directory
COPY client/src/assets/logo1.png /usr/share/nginx/html/src/assets/

# Set the environment variables for Nginx
ENV NGINX_ENVSUBST_OUTPUT_DIR '/etc/nginx/conf.d'

# Copy the Nginx configuration
COPY client/nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Expose port 80 to the outside
EXPOSE 80

# Start Nginx.
CMD ["nginx", "-g", "daemon off;"]
