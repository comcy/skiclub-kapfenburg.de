# Build context is the repo root (pnpm workspace) — build with:
#   docker build -f src/api/sck-api/Dockerfile -t sck-api .

FROM node:22-alpine AS builder
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@11.22.0 --activate

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter sck-api run build
# Self-contained prod-only deploy dir (dist/ + pruned node_modules), the
# standard pnpm-workspace way to hand a single package off to a slim image.
# --legacy: sck-api has no workspace-internal (injected) dependencies, so
# pnpm's newer inject-workspace-packages deploy mode doesn't apply here.
RUN pnpm --filter sck-api deploy --prod --legacy /out

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /out .

EXPOSE 3000
CMD ["node", "dist/index.js"]
