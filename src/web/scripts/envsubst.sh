#!/bin/bash

echo "--------------------------------------------------------------"

# Input-Parameter
export COURSE_SHEET_URL=$1
echo "COURSE_SHEET_URL: $COURSE_SHEET_URL"

export TRIP_SHEET_URL=$2
echo "TRIP_SHEET_URL: $TRIP_SHEET_URL"

export SCK_API_URL=$3
echo "SCK_API_URL: $SCK_API_URL"

# DEPLOY_ENV: which pipeline this build came from - "TEST" (Dockerfile,
# self-hosted-runner deploy to the sck-test LXC) or "PROD"
# (sck-web-app-build-deploy.yml). Shown as the "#<ENV>:<hash>" build tag.
export DEPLOY_ENV=${4:-TEST}
echo "DEPLOY_ENV: $DEPLOY_ENV"

# Dynamisch generierte Metadaten
export BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
export BUILD_NUMBER=${GITHUB_RUN_NUMBER}
# .git isn't present in the Docker build context (excluded via
# .dockerignore), so `git rev-parse` fails there - prefer a hash already
# passed in from outside the container (computed where .git does exist),
# only fall back to computing it here (works for the direct-on-runner
# prod pipeline, which never had this problem).
export GIT_COMMIT_HASH=${GIT_COMMIT_HASH:-$(git rev-parse --short HEAD 2>/dev/null)}

echo "BUILD_DATE: $BUILD_DATE"
echo "BUILD_NUMBER: $BUILD_NUMBER"
echo "GIT_COMMIT_HASH: $GIT_COMMIT_HASH"

# Environment-Datei erzeugen
envsubst ' ${COURSE_SHEET_URL} ${TRIP_SHEET_URL} ${SCK_API_URL} ${BUILD_DATE} ${BUILD_NUMBER} ${GIT_COMMIT_HASH} ${DEPLOY_ENV} ' \
  < ../projects/sck-app/src/environments/environment.template.ts \
  > ../projects/sck-app/src/environments/environment.prod.ts

echo "--------------------------------------------------------------"
cat ../projects/sck-app/src/environments/environment.prod.ts
