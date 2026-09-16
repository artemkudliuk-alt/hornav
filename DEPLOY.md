# Развёртывание на cPanel

Приложение больше не зависит ни от Vercel, ни от Neon. Нужны только Node 20+ и PostgreSQL.

## Переменные окружения

Задаются в cPanel → Setup Node.js App → Environment variables.

| Переменная | Обязательна | Значение |
|---|---|---|
| `DATABASE_URL` | да | `postgres://пользователь:пароль@localhost:5432/база` |
| `AUTH_SECRET` | да | `openssl rand -base64 32` |
| `AUTH_URL` | да | `https://<домен>` — должен точно совпадать с боевым адресом, иначе вход в админку отваливается |
| `UPLOADS_DIR` | да | `/home/<аккаунт>/data/uploads` — **вне папки сборки**, см. ниже |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` | для писем | почтовый ящик, заведённый в cPanel |
| `NOTIFICATION_EMAIL` | для писем | куда слать заявки |
| `EMAIL_SENDER_NAME` | нет | подпись отправителя |
| `TELEGRAM_BOT_TOKEN` `TELEGRAM_WEBHOOK_SECRET` | для Telegram | из @BotFather |

`RESEND_API_KEY` **не задавать** — при его отсутствии почта автоматически идёт через SMTP.

## Загрузки должны жить вне сборки

Каждый деплой перезаписывает папку приложения. Если фотографии лежат внутри неё, они пропадут.

```bash
mkdir -p ~/data/uploads
ln -sfn ~/data/uploads <папка-приложения>/public/uploads
```

Симлинк создаётся заново после каждого деплоя. `UPLOADS_DIR` должен указывать на ту же папку.

## Сборка

Собирает GitHub Actions, не сервер: локальной памяти в 1 ГБ для `next build` не хватает,
а сборка на Windows кладёт в бандл виндовые бинарники, непригодные для Linux.

1. Actions собирает на Linux и кладёт результат в ветку `deploy`
2. На сервере: `git pull` — тянется только изменившееся
3. В cPanel: Restart приложения

Точка входа — `server.js`, версия Node — 24.x, режим — Production.

## База

PostgreSQL на хостинге версии 10, в ней нет `gen_random_uuid()`.
Идентификаторы генерирует приложение (`randomUUID()` в `src/lib/db/schema.ts`),
от базы эта функция больше не требуется. Расширение `pgcrypto` ставить не нужно.

### Перенос данных из Neon

```bash
SOURCE_URL='postgres://user:pass@ep-....neon.tech/neondb?sslmode=require' \
TARGET_URL='postgres://пользователь:пароль@localhost:5432/база' \
node scripts/copy-db.mjs
```

### Перенос фото и файлов из Vercel Blob на диск

```bash
TARGET_URL='postgres://пользователь:пароль@localhost:5432/база' \
UPLOADS_DIR='/home/<аккаунт>/data/uploads' \
node scripts/copy-blob-to-disk.mjs
```
Флаг `--dry` позволяет сделать тестовый прогон без записи на диск и изменений в БД.

