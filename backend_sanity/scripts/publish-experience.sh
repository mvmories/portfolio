#!/usr/bin/env bash
#
# Publishes the experience content in roles.ts to Sanity.
#
# The token is read from a prompt rather than an argument or an env var, so it
# never lands in shell history, in the process list, or in this repo.
#
# Usage, from anywhere:
#   backend_sanity/scripts/publish-experience.sh            # preview only
#   backend_sanity/scripts/publish-experience.sh --write    # publish

set -euo pipefail

cd "$(dirname "$0")/.."

if [ $# -eq 0 ]; then
  echo "Previewing only. Pass --write to publish."
  echo
  exec npx tsx scripts/migrate-experience.ts
fi

read -rsp "Sanity editor token (nothing will appear as you paste): " token
echo
echo

if [ -z "$token" ]; then
  echo "No token given, stopping." >&2
  exit 1
fi

SANITY_WRITE_TOKEN="$token" npx tsx scripts/migrate-experience.ts "$@"
