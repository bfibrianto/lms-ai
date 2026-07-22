# ============================================
# Dockerfile — LMS AI (Next.js 16 standalone + Prisma 7)
# Multi-stage build with pnpm
# ============================================

FROM node:22-alpine AS base

# ---------- Stage: deps ----------
FROM base AS deps
RUN corepack enable && corepack prepare pnpm@11.15.1 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# ---------- Stage: builder ----------
FROM base AS builder
RUN corepack enable && corepack prepare pnpm@11.15.1 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time config for next.config.ts image remotePatterns (optional, override via --build-arg)
ARG MINIO_ENDPOINT
ARG MINIO_PORT
ARG MINIO_USE_SSL
ARG MINIO_BUCKET
ARG RUSTFS_DOMAIN
ENV MINIO_ENDPOINT=${MINIO_ENDPOINT} \
    MINIO_PORT=${MINIO_PORT} \
    MINIO_USE_SSL=${MINIO_USE_SSL} \
    MINIO_BUCKET=${MINIO_BUCKET} \
    RUSTFS_DOMAIN=${RUSTFS_DOMAIN}

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm prisma generate
# compile mode: skip static page generation (no DB during Docker build, pages render at runtime)
RUN pnpm next build --experimental-build-mode=compile

# ---------- Stage: runner ----------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Standalone server output (traced node_modules + server.js)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma: schema, migrations & config for `prisma migrate deploy` on startup
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./

# Install prisma CLI + dotenv in isolated dir (avoids standalone node_modules conflicts)
# Symlinks let prisma.config.ts resolve `dotenv` & `prisma/config` from /app/node_modules
RUN mkdir -p /opt/prisma-cli \
    && cd /opt/prisma-cli \
    && npm init -y \
    && npm install prisma@7.4.0 dotenv \
    && npm cache clean --force \
    && ln -sf /opt/prisma-cli/node_modules/prisma /app/node_modules/prisma \
    && ln -sf /opt/prisma-cli/node_modules/dotenv /app/node_modules/dotenv

# Entrypoint: run migrations then start server
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
