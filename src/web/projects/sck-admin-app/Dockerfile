# Build context is the repo root (pnpm workspace) — build with:
#   docker build -f src/web/projects/sck-admin-app/Dockerfile \
#     --build-arg SCK_API_URL=... -t sck-admin .

FROM node:22-alpine AS builder
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@11.22.0 --activate

COPY . .
RUN pnpm install --frozen-lockfile

ARG SCK_API_URL

# sck-admin-app talks to the same sck-api instance as sck-app, so it reuses
# the same SCK_API_URL value rather than needing its own template/envsubst
# script for a single field - a plain in-place substitute is enough.
RUN sed -i "s|sckApiUrl: ''|sckApiUrl: '$SCK_API_URL'|" \
  src/web/projects/sck-admin-app/src/environments/environment.prod.ts
RUN pnpm --filter web run build:admin

FROM nginx:alpine
# Unlike sck-app, this project's build output nests the static files under
# browser/ (Angular's newer Application Builder default output layout).
COPY --from=builder /repo/src/web/dist/sck-admin-app/browser /usr/share/nginx/html
COPY src/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
