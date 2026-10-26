#!/bin/sh
set -eu
cd "$(dirname "$0")"
image=${1:?Usage: deploy.sh ghcr.io/owner/repo@sha256:digest}
previous=$(cat .deployed-image 2>/dev/null || true)
export PARITINS_IMAGE="$image"
docker compose pull web
# The previous container may predate the CMS. Back up only when it supports it.
if docker compose exec -T web test -f /app/scripts/backup.mjs; then
  docker compose exec -T web node scripts/backup.mjs "/app/data/backups/before-deploy-$(date -u +%Y%m%dT%H%M%SZ).sqlite"
fi
if docker compose up -d --no-build --wait --wait-timeout 120; then
  printf '%s\n' "$image" > .deployed-image
else
  echo 'Deployment failed.' >&2
  if [ -n "$previous" ]; then
    echo 'Restoring previous image.' >&2
    export PARITINS_IMAGE="$previous"
    docker compose up -d --no-build --wait --wait-timeout 120
  fi
  exit 1
fi
