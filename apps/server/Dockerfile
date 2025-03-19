FROM node:lts-alpine AS pruner

WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=server --docker

FROM node:lts-alpine AS installer

WORKDIR /app
COPY --from=pruner /app/out/json .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/full .
COPY --from=pruner /app/turbo.json ./turbo.json
RUN npm install -g pnpm

# Install dependencies without running postinstall script yet
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM node:lts-alpine AS builder
WORKDIR /app
COPY --from=installer /app/ .
# Accept DATABASE_URL as a build argument
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npm install -g pnpm

# First ensure the schema file exists and is accessible
RUN ls -la apps/server/prisma/

# Generate Prisma client with absolute path
RUN cd apps/server && npx prisma generate --schema=/app/apps/server/prisma/schema.prisma

# Then run the build
RUN pnpm run build

FROM node:lts-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install build dependencies for bcrypt
RUN apk add --no-cache python3 make g++

# Copy package.json files and other necessary files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/prisma ./apps/server/prisma

# Install production dependencies only and rebuild bcrypt
RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile && \
    cd apps/server && \
    npx prisma generate --schema=./prisma/schema.prisma

# DATABASE_URL will be provided by Render at runtime
CMD ["node", "apps/server/dist/src/main"]