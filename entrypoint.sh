#!/bin/sh

set -e

if [ ! -f "/app/.migration_applied" ]; then
    echo "Applying Prisma migrations..."
    npx prisma migrate deploy
    touch /app/.migration_applied
else
    echo "Migrations already applied. Skipping..."
fi

echo "Starting the application..."
exec "$@"
