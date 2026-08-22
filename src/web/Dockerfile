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
ARG BUILD_NUMBER

# Reuses the same environment.prod.ts generation the existing CI web
# workflow runs (see .github/workflows/sck-web-app-build-deploy.yml) —
# one substitution script, one source of truth for the template fill-in.
# GITHUB_RUN_NUMBER doesn't cross the docker build isolation boundary on
# its own (unlike BUILD_DATE/GIT_COMMIT_HASH, which envsubst.sh computes
# natively inside the container) - has to come in as a build ARG instead.
RUN cd src/web/scripts && GITHUB_RUN_NUMBER="$BUILD_NUMBER" ./envsubst.sh "$COURSE_SHEET_URL" "$TRIP_SHEET_URL" "$SCK_API_URL"
RUN pnpm --filter web run build

FROM nginx:alpine
COPY --from=builder /repo/src/web/dist/sck-app /usr/share/nginx/html
COPY src/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
