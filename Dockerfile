# Stage 1: Base image
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add -g turbo

# Stage 2: Pruner
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune @nexus/core --docker

# Stage 3: Builder
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN turbo build --filter=@nexus/core

# Stage 4: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 core
USER core

COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-workspace.yaml .
COPY --from=builder /app/packages/core/package.json ./packages/core/package.json
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/node_modules ./node_modules

# Ensure dependencies are available for execution
ENV NODE_ENV=production

EXPOSE 3000

# Using a standard health check command (wget since it's alpine)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "packages/core/dist/index.js"]
