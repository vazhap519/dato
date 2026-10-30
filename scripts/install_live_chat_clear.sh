#!/usr/bin/env bash
# Live chat auto-clear deployment. No .env changes, migrations or bot operations.
set -Eeuo pipefail
cd /var/www/dato
BACKUP="/root/backups/live-chat-clear-$(date +%Y%m%d-%H%M%S)"
REF=origin/main
FILES=(
  "app/Models/LiveSession.php"
  "app/Http/Controllers/LiveController.php"
  "app/Console/Commands/PurgeEndedLiveChats.php"
  "resources/js/Pages/Live.jsx"
  "scripts/install_live_chat_clear.sh"
)
mkdir -p "$BACKUP/original" "$BACKUP/staged"
echo "Резервная копия: $BACKUP"
for file in "${FILES[@]}"; do
  mkdir -p "$BACKUP/staged/$(dirname "$file")"
  git show "$REF:$file" > "$BACKUP/staged/$file"
  case "$file" in *.php) php -l "$BACKUP/staged/$file" >/dev/null ;; *.sh) bash -n "$BACKUP/staged/$file" ;; esac
  if [ -f "$file" ]; then
    mkdir -p "$BACKUP/original/$(dirname "$file")"
    cp -a "$file" "$BACKUP/original/$file"
  fi
done
[ ! -d public/build ] || cp -a public/build "$BACKUP/build"
[ ! -f resources/data/explore-copy-manifest.json ] || cp -a resources/data/explore-copy-manifest.json "$BACKUP/explore-copy-manifest.json"
rollback() {
  result=$?
  trap - ERR
  echo "Ошибка $result, восстанавливаем исходные файлы и сборку..." >&2
  for file in "${FILES[@]}"; do
    if [ -f "$BACKUP/original/$file" ]; then cp -a "$BACKUP/original/$file" "$file"; else rm -f "$file"; fi
  done
  if [ -d "$BACKUP/build" ]; then rm -rf public/build; cp -a "$BACKUP/build" public/build; fi
  [ ! -f "$BACKUP/explore-copy-manifest.json" ] || cp -a "$BACKUP/explore-copy-manifest.json" resources/data/explore-copy-manifest.json
  php artisan optimize:clear || true
  echo "Код восстановлен. Путь: $BACKUP" >&2
  exit "$result"
}
trap rollback ERR
for file in "${FILES[@]}"; do
  mkdir -p "$(dirname "$file")"
  cp -a "$BACKUP/staged/$file" "$file"
done
echo "Проверка PHP..."
php -l app/Models/LiveSession.php
php -l app/Http/Controllers/LiveController.php
php -l app/Console/Commands/PurgeEndedLiveChats.php
echo "Сборка frontend..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json
echo "Проверка отдельного JS-модуля эфира..."
node - <<'JS'
const fs=require('fs');
const manifest=JSON.parse(fs.readFileSync('public/build/manifest.json','utf8'));
const live=manifest['resources/js/Pages/Live.jsx'];
if(!live?.file)throw Error('Live page missing in Vite manifest');
const content=fs.readFileSync('resources/js/Pages/Live.jsx','utf8');
if(!content.includes('Эфир завершён. Чат очищен.'))throw Error('Chat empty state missing');
const model=fs.readFileSync('app/Models/LiveSession.php','utf8');
const controller=fs.readFileSync('app/Http/Controllers/LiveController.php','utf8');
if(!model.includes("wasChanged('status')")||!model.includes('messages()->delete()'))throw Error('Status cleanup hook missing');
if(!controller.includes("if ($session->status === 'ended') return response()->json([])"))throw Error('Completed-chat API protection missing');
console.log('PASS Live page chunk and end-of-broadcast chat controls');
JS
echo "Проверка доступа к команде и списку завершённых эфиров..."
php artisan live:purge-ended-chats
php artisan route:list --path=live > "$BACKUP/live-routes.txt"
php artisan optimize:clear
trap - ERR
echo "Сборка успешна; очищаем старые сообщения завершённых эфиров..."
php artisan live:purge-ended-chats --apply
echo "Готово: завершение эфира теперь очищает его чат."
echo "Резервная копия кода: $BACKUP"
echo "Примечание: удалённые сообщения завершённых эфиров не восстанавливаются из резервной копии кода."
