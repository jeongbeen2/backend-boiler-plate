#!/usr/bin/env sh
set -e

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
WAIT_SECONDS="${WAIT_SECONDS:-60}"

echo "⏳ Waiting for database at ${DB_HOST}:${DB_PORT} (timeout: ${WAIT_SECONDS}s)..."
for i in $(seq 1 "$WAIT_SECONDS"); do
  if nc -z "$DB_HOST" "$DB_PORT" >/dev/null 2>&1; then
    echo "✅ 데이터베이스 활성화 성공!"
    break
  fi
  sleep 1
done

# 마지막 확인
if ! nc -z "$DB_HOST" "$DB_PORT" >/dev/null 2>&1; then
  echo "❌ 데이터베이스 접속 실패 (시간 초과: ${WAIT_SECONDS}s)" >&2
  exit 1
fi

echo "🚚 Running Prisma migrations..."
# 운영/공식 경로: migrate deploy
if ! npx prisma migrate deploy; then
  echo "⚠️ migrate deploy 실패. 'prisma db push'로 대체 (개발 전용)."
  npx prisma db push
fi

if [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Running seeds..."
  # npm script가 있으면 사용, 없으면 ts-node 직행
  if npm run -s seed; then
    echo "✅ Seed 완료 (npm script 사용)"
  else
    echo "ℹ️ 'npm run seed' 없거나 실패. 'npx ts-node prisma/seed.ts' 시도..."
    npx ts-node prisma/seed.ts || {
      echo "❌ Seed failed."; exit 1;
    }
  fi
else
  echo "⏭️ Seed 건너뛰기 (RUN_SEED != true)."
fi

echo "🚀 Starting app: $*"
exec "$@"
