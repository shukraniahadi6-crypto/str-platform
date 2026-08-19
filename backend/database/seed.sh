#!/usr/bin/env bash
set -euo pipefail
: "${DATABASE_URL:?DATABASE_URL is required}"
node "$(dirname "$0")/seeds/seed.ts"
