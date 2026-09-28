#!/usr/bin/env bash
# Перенос живых данных с cPanel на Vercel: база -> Neon, файлы -> Vercel Blob.
#
# Веб-терминал cPanel ненадёжен: соединение рвётся, а скрытый ввод пароля
# выглядит как зависание. Поэтому:
#   - секреты берутся из файла ~/vercel-migrate/secrets.txt (три строки:
#     DATABASE_URL из Neon, пароль базы cPanel, BLOB_READ_WRITE_TOKEN);
#   - работа уходит в фон через nohup и пишет журнал в ~/vercel-migrate/migrate.log,
#     так что обрыв терминала её не прерывает;
#   - файл с секретами удаляется по завершении, при любом исходе.
#
#   curl -fsSL <этот файл> -o ~/migrate.sh && bash ~/migrate.sh

set -euo pipefail

REPO_RAW="https://raw.githubusercontent.com/artemkudliuk-alt/hornav/main/scripts"
DB_USER="maxic191_hornav111"
DB_NAME="maxic191_hornav"
UPLOADS_DIR="$HOME/data/uploads"
WORK="$HOME/vercel-migrate"
SECRETS="$WORK/secrets.txt"
LOG="$WORK/migrate.log"

trim() { local s="$1"; s="${s//$'\r'/}"; s="${s#"${s%%[![:space:]]*}"}"; s="${s%"${s##*[![:space:]]}"}"; printf '%s' "$s"; }

# ---------- 1. передний план: проверить файл и уйти в фон ----------
if [ "${MIGRATE_BG:-}" != "1" ]; then
  mkdir -p "$WORK"
  [ -s "$SECRETS" ] || { echo "Нет файла $SECRETS"; exit 1; }
  if grep -q "ВСТАВЬТЕ" "$SECRETS"; then
    echo "В $SECRETS остались строки-заглушки. Замените все три и сохраните."; exit 1
  fi
  MIGRATE_BG=1 nohup bash "$0" "$@" > "$LOG" 2>&1 < /dev/null &
  echo "Перенос запущен в фоне (pid $!). Журнал: $LOG"
  echo "Терминал можно закрыть — работа не прервётся."
  exit 0
fi

# ---------- 2. фон ----------
cleanup() { shred -u "$SECRETS" 2>/dev/null || rm -f "$SECRETS"; echo "[секреты удалены]"; }
trap cleanup EXIT

echo "=== старт $(date '+%F %T') ==="

# Системный Node CloudLinux напрямую, НЕ через окружение приложения:
# обёртка npm из nodevenv дописывает --prefix <окружение боевого приложения>.
NODE_DIR=$(ls -d /opt/alt/alt-nodejs2*/root/usr/bin 2>/dev/null | sort -V | tail -1 || true)
[ -n "$NODE_DIR" ] || { echo "Не найден Node в /opt/alt"; exit 1; }
export PATH="$NODE_DIR:/usr/bin:/bin"
unset npm_config_prefix NODE_PATH
echo "node $(node -v)"

[ -d "$UPLOADS_DIR" ] || { echo "Нет папки загрузок $UPLOADS_DIR"; exit 1; }
echo "файлов в $UPLOADS_DIR: $(find "$UPLOADS_DIR" -type f | wc -l)"

cd "$WORK"
[ -f package.json ] || npm init -y >/dev/null
if [ ! -d node_modules/pg ] || [ ! -d node_modules/@vercel/blob ]; then
  echo "ставлю pg и @vercel/blob..."
  npm install --prefix "$WORK" --no-audit --no-fund --no-save --loglevel=error pg @vercel/blob
fi
curl -fsSL "$REPO_RAW/copy-db.mjs" -o copy-db.mjs
curl -fsSL "$REPO_RAW/copy-disk-to-blob.mjs" -o copy-disk-to-blob.mjs

NEON_URL=$(trim "$(sed -n 1p "$SECRETS")")
DB_PASS=$(trim "$(sed -n 2p "$SECRETS")")
BLOB_TOKEN=$(trim "$(sed -n 3p "$SECRETS")")

case "$NEON_URL" in postgres://*|postgresql://*) ;; *) echo "Строка 1 не похожа на DATABASE_URL"; exit 1;; esac
[ -n "$DB_PASS" ] || { echo "Строка 2 (пароль cPanel) пустая"; exit 1; }
case "$BLOB_TOKEN" in vercel_blob_rw_*) ;; *) echo "Строка 3 не похожа на BLOB_READ_WRITE_TOKEN"; exit 1;; esac
echo "секреты прочитаны: 3 строки, форматы верные"

# спецсимволы пароля ломают адрес подключения — кодируем
ENC=$(node -e 'process.stdout.write(encodeURIComponent(process.argv[1]))' "$DB_PASS")
SOURCE_URL="postgres://$DB_USER:$ENC@localhost:5432/$DB_NAME"

echo; echo "========== ПРОБНЫЙ ПРОГОН: что лежит на cPanel =========="
SOURCE_URL="$SOURCE_URL" TARGET_URL="$NEON_URL" node copy-db.mjs --dry

echo; echo "========== 1. БАЗА: cPanel -> Neon =========="
SOURCE_URL="$SOURCE_URL" TARGET_URL="$NEON_URL" node copy-db.mjs --truncate

echo; echo "========== 2. ФАЙЛЫ: диск cPanel -> Vercel Blob =========="
TARGET_URL="$NEON_URL" UPLOADS_DIR="$UPLOADS_DIR" BLOB_READ_WRITE_TOKEN="$BLOB_TOKEN" \
  node copy-disk-to-blob.mjs

echo; echo "=== ГОТОВО $(date '+%F %T') ==="
