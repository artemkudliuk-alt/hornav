#!/usr/bin/env bash
# Перенос живых данных с cPanel на Vercel: база -> Neon, файлы -> Vercel Blob.
# Запускается в Terminal на сервере cPanel. Секреты спрашивает интерактивно,
# в историю команд и в переписку они не попадают.
#
#   bash <(curl -fsSL https://raw.githubusercontent.com/artemkudliuk-alt/hornav/main/scripts/migrate-to-vercel.sh)

set -euo pipefail

REPO_RAW="https://raw.githubusercontent.com/artemkudliuk-alt/hornav/main/scripts"
DB_USER="maxic191_hornav111"
DB_NAME="maxic191_hornav"
UPLOADS_DIR="$HOME/data/uploads"
WORK="$HOME/vercel-migrate"

# Node на CloudLinux живёт в виртуальном окружении приложения
if ! command -v node >/dev/null 2>&1; then
  ACT=$(ls -d "$HOME"/nodevenv/*/2*/bin/activate 2>/dev/null | head -1 || true)
  # activate от CloudLinux читает неустановленные переменные — на время снимаем -u
  if [ -n "$ACT" ]; then set +u; source "$ACT"; set -u; fi
fi
command -v node >/dev/null 2>&1 || { echo "Не найден node. Проверьте Setup Node.js App."; exit 1; }
echo "node $(node -v)"

[ -d "$UPLOADS_DIR" ] || { echo "Нет папки загрузок $UPLOADS_DIR"; exit 1; }
echo "файлов в $UPLOADS_DIR: $(find "$UPLOADS_DIR" -type f | wc -l)"

mkdir -p "$WORK" && cd "$WORK"
[ -f package.json ] || npm init -y >/dev/null
echo "ставлю pg и @vercel/blob..."
npm install --silent --no-audit --no-fund pg @vercel/blob
curl -fsSL "$REPO_RAW/copy-db.mjs" -o copy-db.mjs
curl -fsSL "$REPO_RAW/copy-disk-to-blob.mjs" -o copy-disk-to-blob.mjs

echo
read -rp  "1/3  DATABASE_URL из Vercel (Neon): " NEON_URL
read -rsp "2/3  пароль базы cPanel ($DB_USER): " DB_PASS; echo
read -rsp "3/3  BLOB_READ_WRITE_TOKEN из Vercel: " BLOB_TOKEN; echo

# спецсимволы пароля ломают адрес подключения — кодируем
ENC=$(node -e 'process.stdout.write(encodeURIComponent(process.argv[1]))' "$DB_PASS")
SOURCE_URL="postgres://$DB_USER:$ENC@localhost:5432/$DB_NAME"

echo; echo "========== ПРОБНЫЙ ПРОГОН: что лежит на cPanel =========="
SOURCE_URL="$SOURCE_URL" TARGET_URL="$NEON_URL" node copy-db.mjs --dry

echo
read -rp "Переносить базу? Данные в Neon будут ЗАМЕНЕНЫ данными с cPanel (y/N): " OK
[ "$OK" = "y" ] || { echo "Отменено."; exit 0; }

echo; echo "========== 1. БАЗА: cPanel -> Neon =========="
SOURCE_URL="$SOURCE_URL" TARGET_URL="$NEON_URL" node copy-db.mjs --truncate

echo; echo "========== 2. ФАЙЛЫ: диск cPanel -> Vercel Blob =========="
TARGET_URL="$NEON_URL" UPLOADS_DIR="$UPLOADS_DIR" BLOB_READ_WRITE_TOKEN="$BLOB_TOKEN" \
  node copy-disk-to-blob.mjs

echo; echo "Готово. Пришлите этот вывод целиком."
