FROM node:20-alpine
WORKDIR /usr/src/app

# Install build deps
RUN apk add --no-cache python3 make g++ bash

# Install app dependencies
COPY backend/package*.json ./
# Copy source and local packages so postinstall (prisma generate) can run
COPY backend/ ./
COPY common/ ./common/

# Make the local monorepo package available to npm by placing it under node_modules
RUN mkdir -p node_modules/@dieti-estates-2025 && cp -R ./common node_modules/@dieti-estates-2025/common

# Ensure top-level config files referenced by prisma.config.ts are available
# (prisma.config.ts references ../tsconfig.json)
COPY tsconfig.json ../tsconfig.json

# Install dependencies (postinstall will run prisma generate)
RUN npm install --no-audit --no-fund

# Build
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main/index.js"]
