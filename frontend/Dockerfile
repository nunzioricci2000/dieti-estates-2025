FROM node:20-bullseye AS builder
WORKDIR /usr/src/app

# Install build tools
RUN apt-get update && apt-get install -y python3 build-essential bash && rm -rf /var/lib/apt/lists/*

# Copy package files and install with yarn (project uses yarn v4)
## Copy workspace root and packages so Yarn workspaces resolve correctly
COPY package.json ./
COPY backend ./backend
COPY common ./common
COPY frontend ./frontend

RUN corepack enable && corepack prepare yarn@4.14.1 --activate
# Install only the workspace dependencies needed to build the frontend
RUN yarn workspaces focus @dieti-estates-2025/frontend

# Build frontend
WORKDIR /usr/src/app/frontend
RUN yarn build
WORKDIR /usr/src/app

FROM node:20-bullseye
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy built app and dependencies from builder
COPY --from=builder /usr/src/app/.next .next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 3000
CMD ["yarn", "start"]
