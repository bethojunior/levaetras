#!/usr/bin/env bash
set -euo pipefail
image=${1:?Usage: deploy-local.sh IMAGE ABSOLUTE_DEPLOY_DIRECTORY}
paritins_deploy_dir=${2:?Provide a persistent directory outside the runner workspace}
[[ "$image" =~ ^ghcr.io/[a-z0-9._/-]+@sha256:[a-f0-9]{64}$ ]] || { echo 'Expected an immutable GHCR image digest.' >&2; exit 1; }
[[ "$paritins_deploy_dir" = /* ]] || { echo 'Deployment directory must be absolute.' >&2; exit 1; }
paritins_source_dir=$(cd "$(dirname "$0")/.." && pwd -P)
mkdir -p "$paritins_deploy_dir"
paritins_deploy_dir=$(cd "$paritins_deploy_dir" && pwd -P)
# A checkout cleanup must never remove the running site's configuration or state.
case "$paritins_deploy_dir/" in
  "$paritins_source_dir/"*) echo 'Deployment directory must be outside the checkout.' >&2; exit 1 ;;
esac
if [[ -n "${RUNNER_WORKSPACE:-}" ]]; then
  paritins_workspace=$(cd "$RUNNER_WORKSPACE" && pwd -P)
  case "$paritins_deploy_dir/" in
    "$paritins_workspace/"*) echo 'Deployment directory must be outside RUNNER_WORKSPACE.' >&2; exit 1 ;;
  esac
fi
[[ -f "$paritins_deploy_dir/.env" ]] || { echo 'Configure the production .env before deploying.' >&2; exit 1; }
install -m 644 "$paritins_source_dir/compose.yaml" "$paritins_deploy_dir/compose.yaml"
install -m 755 "$paritins_source_dir/scripts/deploy.sh" "$paritins_deploy_dir/deploy.sh"
# Run in the stable directory to preserve Compose project/volume names and rollback state.
cd "$paritins_deploy_dir"
sh ./deploy.sh "$image"
