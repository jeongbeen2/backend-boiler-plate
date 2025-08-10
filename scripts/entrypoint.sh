#!/bin/sh
set -e

echo "Waiting for database..."
sleep 5

echo "Running Prisma migrations..."
npx prisma migrate deploy || npx prisma db push

if [ "$RUN_SEED" = "true" ]; then
  echo "Running seeds..."
  npm run seed
fi

echo "Starting application..."
exec "$@"
