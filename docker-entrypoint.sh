#!/bin/sh
set -e

echo "==> Running database migrations..."
/opt/prisma-cli/node_modules/.bin/prisma migrate deploy

echo "==> Starting Next.js server..."
exec "$@"
