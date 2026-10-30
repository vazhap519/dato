#!/usr/bin/env bash
set -Eeuo pipefail
cd /var/www/dato
REF=origin/main
BACKUP="/root/backups/live-rate-limit-fix-$(date +%Y%m%d-%H%M%S)"
FILES=("routes/web.php" "resources/js/Pages/Live.jsx" "scripts/install_live_rate_limit_fix.sh")
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
  echo "Ошибка $rc. Восстанавливаем исходные файлы и предыдущую сборку..." >&2
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
php -l routes/web.php
node - <<'JS'
const fs=require('fs');
const routes=fs.readFileSync('routes/web.php','utf8');
const jsx=fs.readFileSync('resources/js/Pages/Live.jsx','utf8');
for(const s of ["RateLimiter::for('live-message-read'","RateLimiter::for('live-status-change'","throttle:live-message-read","throttle:live-status-change"]) if(!routes.includes(s))throw Error('Missing isolated limiter: '+s);
if(!jsx.includes("setInterval(refresh, 2500)"))throw Error('Chat polling not throttled');
if(!jsx.includes('setStatusError(e.message)')||!jsx.includes('{statusError &&'))throw Error('Missing status error display');
if(jsx.includes('Чат очищен'))throw Error('Obsolete ended message');
console.log('PASS: dedicated read/status limiters, 2.5s polling, status feedback');
JS
echo "Собираем frontend..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
node - <<'JS'
const fs=require('fs');
const m=JSON.parse(fs.readFileSync('public/build/manifest.json','utf8'));
if(!m['resources/js/Pages/Live.jsx']?.file)throw Error('Live page missing');
console.log('PASS: Live page compiled');
JS
php artisan route:list --path=live > "$BACKUP/live-routes.txt"
grep -q 'sessions/{session}/status' "$BACKUP/live-routes.txt"
php artisan optimize:clear
trap - ERR
echo "ГОТОВО. Ошибка Too Many Attempts от пересечения лимитов исправлена на уровне маршрутов."
echo "Резервная копия: $BACKUP"
echo "Проверь переключатель на /live под администратором. Не требуется очистка базы данных."
