# Build context is the repo root (pnpm workspace) — build with:
#   docker build -f src/web/Dockerfile \
#     --build-arg COURSE_SHEET_URL=... --build-arg TRIP_SHEET_URL=... --build-arg SCK_API_URL=... \
#     -t sck-web .

FROM node:22-alpine AS builder
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@11.22.0 --activate
RUN apk add --no-cache git bash gettext

COPY . .
RUN pnpm install --frozen-lockfile

ARG COURSE_SHEET_URL
ARG TRIP_SHEET_URL
ARG SCK_API_URL
ARG TURNSTILE_SITE_KEY
ARG BUILD_NUMBER
ARG GIT_COMMIT_HASH

# Reuses the same environment.prod.ts generation the existing CI web
# workflow runs (see .github/workflows/sck-web-app-build-deploy.yml) —
# one substitution script, one source of truth for the template fill-in.
# GITHUB_RUN_NUMBER and GIT_COMMIT_HASH don't cross the docker build
# isolation boundary on their own (.git is excluded via .dockerignore, and
# GITHUB_RUN_NUMBER is just a host env var) - both come in as build ARGs.
RUN cd src/web/scripts && GITHUB_RUN_NUMBER="$BUILD_NUMBER" GIT_COMMIT_HASH="$GIT_COMMIT_HASH" ./envsubst.sh "$COURSE_SHEET_URL" "$TRIP_SHEET_URL" "$SCK_API_URL" "TEST" "$TURNSTILE_SITE_KEY"
RUN pnpm --filter web run build

FROM nginx:alpine
COPY --from=builder /repo/src/web/dist/sck-app /usr/share/nginx/html
COPY src/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
