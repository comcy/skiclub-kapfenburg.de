#!/bin/bash

echo "--------------------------------------------------------------"

# Input-Parameter
export COURSE_SHEET_URL=$1
echo "COURSE_SHEET_URL: $COURSE_SHEET_URL"

export TRIP_SHEET_URL=$2
echo "TRIP_SHEET_URL: $TRIP_SHEET_URL"

export SCK_API_URL=$3
echo "SCK_API_URL: $SCK_API_URL"

# Dynamisch generierte Metadaten
export BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
export BUILD_NUMBER=${GITHUB_RUN_NUMBER}
export GIT_COMMIT_HASH=$(git rev-parse --short HEAD)

echo "BUILD_DATE: $BUILD_DATE"
echo "BUILD_NUMBER: $BUILD_NUMBER"
echo "GIT_COMMIT_HASH: $GIT_COMMIT_HASH"

# Environment-Datei erzeugen
envsubst ' ${COURSE_SHEET_URL} ${TRIP_SHEET_URL} ${SCK_API_URL} ${BUILD_DATE} ${BUILD_NUMBER} ${GIT_COMMIT_HASH} ' \
  < ../projects/sck-app/src/environments/environment.template.ts \
  > ../projects/sck-app/src/environments/environment.prod.ts

echo "--------------------------------------------------------------"
cat ../projects/sck-app/src/environments/environment.prod.ts
