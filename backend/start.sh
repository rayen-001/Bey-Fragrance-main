#!/bin/sh
set -e

echo "🔄 Generating Prisma Client..."
npx prisma generate --config prisma.config.ts

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy --config prisma.config.ts || echo "⚠️ Migration deploy skipped (no migration files)"

echo "🚀 Starting application..."
exec npm start
