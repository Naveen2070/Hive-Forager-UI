# -----------------------------------------------------------------------------
# Stage 1: Build the React Application
# -----------------------------------------------------------------------------
FROM node:22-alpine3.23 AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Serve with Nginx (Production)
# -----------------------------------------------------------------------------
FROM nginx:alpine3.23-slim

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the static React build from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config (we will create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]