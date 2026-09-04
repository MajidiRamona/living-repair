#!/bin/sh
set -e

# Prisma won't create missing parent directories for the SQLite file itself, and this
# runs before the app code (whose own mkdir in lib/uploads.ts hasn't had a chance yet) —
# so make sure both target directories exist on a fresh volume before anything touches them.
db_path="${DATABASE_URL#file:}"
mkdir -p "$(dirname "$db_path")"
mkdir -p "${UPLOADS_DIR:-/data/uploads}"

npx prisma migrate deploy
exec "$@"
