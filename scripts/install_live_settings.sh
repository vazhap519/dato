#!/usr/bin/env bash
# Additive live-session publication and presentation controls.
set -Eeuo pipefail
cd /var/www/dato
REF=origin/main
BACKUP="/root/backups/live-settings-$(date +%Y%m%d-%H%M%S)"
FILES=(
 "app/Models/LiveSession.php"
 "app/Http/Controllers/LiveController.php"
 "app/Filament/Resources/LiveSessions/LiveSessionResource.php"
 "resources/js/Pages/Live.jsx"
 "database/migrations/2026_10_30_000002_add_live_publication_controls.php"
 "scripts/install_live_settings.sh"
)
mkdir -p "$BACKUP/original" "$BACKUP/staged"
echo "Резервная копия: $BACKUP"
for file in "${FILES[@]}"; do
 mkdir -p "$BACKUP/staged/$(dirname "$file")"
 git show "$REF:$file" > "$BACKUP/staged/$file"
 case "$file" in *.php) php -l "$BACKUP/staged/$file" >/dev/null;; *.sh) bash -n "$BACKUP/staged/$file";; esac
 if [ -f "$file" ]; then mkdir -p "$BACKUP/original/$(dirname "$file")"; cp -a "$file" "$BACKUP/original/$file"; fi
done
if [ -d public/build ]; then cp -a public/build "$BACKUP/build"; fi
if [ -f resources/data/explore-copy-manifest.json ]; then cp -a resources/data/explore-copy-manifest.json "$BACKUP/explore-copy-manifest.json"; fi
rollback() {
 rc=$?
 trap - ERR
 echo "Ошибка ($rc). Возвращаем предыдущий код и frontend." >&2
 for file in "${FILES[@]}"; do
  if [ -f "$BACKUP/original/$file" ]; then cp -a "$BACKUP/original/$file" "$file"; else rm -f "$file"; fi
 done
 if [ -d "$BACKUP/build" ]; then rm -rf public/build; cp -a "$BACKUP/build" public/build; fi
 if [ -f "$BACKUP/explore-copy-manifest.json" ]; then cp -a "$BACKUP/explore-copy-manifest.json" resources/data/explore-copy-manifest.json; fi
 php artisan optimize:clear || true
 echo "Код восстановлен. Миграция БД, если уже выполнена, остаётся (она только добавляет поля)." >&2
 echo "Резервная копия: $BACKUP" >&2
 exit "$rc"
}
trap rollback ERR
for file in "${FILES[@]}"; do mkdir -p "$(dirname "$file")"; cp -a "$BACKUP/staged/$file" "$file"; done
echo "Проверяем форму и JSX..."
php -l app/Models/LiveSession.php
php -l app/Http/Controllers/LiveController.php
php -l app/Filament/Resources/LiveSessions/LiveSessionResource.php
php -l database/migrations/2026_10_30_000002_add_live_publication_controls.php
node - <<'JS'
const fs=require('fs'), parser=require('@babel/parser');
const jsx=fs.readFileSync('resources/js/Pages/Live.jsx','utf8');
parser.parse(jsx,{sourceType:'module',plugins:['jsx']});
for(const key of ['show_chat','show_video','video_placeholder','chat_title','chat_empty_text','tab_label','is_published'])if(!jsx.includes(key))throw Error('Missing live setting '+key);
const php=fs.readFileSync('app/Http/Controllers/LiveController.php','utf8');
if(!php.includes("where('is_published', true)"))throw Error('Publication filter missing');
console.log('PASS: JSX, publication and all appearance settings');
JS
echo "Собираем frontend..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
node - <<'JS'
const fs=require('fs'),m=JSON.parse(fs.readFileSync('public/build/manifest.json','utf8'));
if(!m['resources/js/Pages/Live.jsx']?.file)throw Error('Missing Live page chunk');
console.log('PASS: Live page compiled');
JS
echo "Добавляем новые настройки в базу (без удаления существующих данных)..."
php artisan migrate --force
echo "Проверяем новые поля..."
php artisan tinker --execute='foreach (["is_published","sort_order","tab_label","chat_title","video_placeholder","chat_empty_text","show_video","show_chat"] as $c) { if (!\Illuminate\Support\Facades\Schema::hasColumn("live_sessions",$c)) { throw new \RuntimeException("Missing column: ".$c); } } echo "PASS: all live-session columns";'
php artisan optimize:clear
trap - ERR
echo "ГОТОВО: настройки публикации и оформления эфиров установлены."
echo "Существующие эфиры сохранены и первоначально опубликованы; новые по умолчанию скрыты."
echo "Управление: Filament → Прямые эфиры."
echo "Резервная копия: $BACKUP"
