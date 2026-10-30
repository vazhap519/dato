#!/usr/bin/env bash
set -Eeuo pipefail
cd /var/www/dato
REF=origin/main
BACKUP="/root/backups/live-status-control-$(date +%Y%m%d-%H%M%S)"
FILES=(
  "app/Http/Controllers/LiveController.php"
  "resources/js/Pages/Live.jsx"
  "routes/web.php"
  "scripts/install_live_status_control.sh"
)
mkdir -p "$BACKUP/original" "$BACKUP/staged"
echo "Резервная копия: $BACKUP"
for file in "${FILES[@]}"; do
  mkdir -p "$BACKUP/staged/$(dirname "$file")"
  git show "$REF:$file" > "$BACKUP/staged/$file"
  case "$file" in *.php) php -l "$BACKUP/staged/$file" >/dev/null ;; *.sh) bash -n "$BACKUP/staged/$file" ;; esac
  if [ -f "$file" ]; then mkdir -p "$BACKUP/original/$(dirname "$file")"; cp -a "$file" "$BACKUP/original/$file"; fi
done
[ ! -d public/build ] || cp -a public/build "$BACKUP/build"
[ ! -f resources/data/explore-copy-manifest.json ] || cp -a resources/data/explore-copy-manifest.json "$BACKUP/explore-copy-manifest.json"
rollback() {
  rc=$?
  trap - ERR
  echo "Ошибка $rc. Восстановление кода и предыдущей сборки..." >&2
  for file in "${FILES[@]}"; do
    if [ -f "$BACKUP/original/$file" ]; then cp -a "$BACKUP/original/$file" "$file"; else rm -f "$file"; fi
  done
  if [ -d "$BACKUP/build" ]; then rm -rf public/build; cp -a "$BACKUP/build" public/build; fi
  [ ! -f "$BACKUP/explore-copy-manifest.json" ] || cp -a "$BACKUP/explore-copy-manifest.json" resources/data/explore-copy-manifest.json
  php artisan optimize:clear || true
  echo "Откат завершён: $BACKUP" >&2
  exit "$rc"
}
trap rollback ERR
for file in "${FILES[@]}"; do mkdir -p "$(dirname "$file")"; cp -a "$BACKUP/staged/$file" "$file"; done
echo "Проверка PHP и разграничения доступа..."
php -l app/Http/Controllers/LiveController.php
php -l routes/web.php
php -r '$s = file_get_contents("app/Http/Controllers/LiveController.php"); if (!str_contains($s, "public function updateStatus(") || !str_contains($s, "abort_unless(")) { fwrite(STDERR, "Status access check missing\n"); exit(1); }'
echo "Проверка надписи и элемента управления..."
node - <<'JS'
const fs = require('fs');
const jsx=fs.readFileSync('resources/js/Pages/Live.jsx','utf8');
if(!jsx.includes('canManageStatus && session')) throw Error('Admin-only status control missing');
if(!jsx.includes('Изменить статус эфира')) throw Error('Status control missing');
if(jsx.includes('Чат очищен')) throw Error('Old chat phrase still visible');
if(!jsx.includes('Все сообщения этого эфира будут удалены')) throw Error('Delete confirmation missing');
console.log('PASS: admin status control, confirmation and chat message');
JS
echo "Сборка..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
node - <<'JS'
const fs=require('fs');
const manifest=JSON.parse(fs.readFileSync('public/build/manifest.json','utf8'));
if(!manifest['resources/js/Pages/Live.jsx']?.file) throw Error('Live page missing from build');
console.log('PASS: compiled live page');
JS
php artisan route:list --path=live > "$BACKUP/live-routes.txt"
grep -q 'sessions/{session}/status' "$BACKUP/live-routes.txt"
php artisan optimize:clear
trap - ERR
echo "Готово. Управление статусом на /live установлено."
echo "Резервная копия: $BACKUP"
