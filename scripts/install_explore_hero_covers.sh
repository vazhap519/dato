#!/usr/bin/env bash
# Install editable hero cover for nine newer Explore pages.
# Backs up only touched code, CMS manifest, and frontend bundle.
# Never changes .env or touches the Telegram service.
set -Eeuo pipefail
cd /var/www/dato
BACKUP="/root/backups/explore-hero-covers-$(date +%Y%m%d-%H%M%S)"
FILES=(
    "app/Filament/Resources/ExploreContentPages/ExploreContentPageResource.php"
    "routes/web.php"
    "resources/js/Pages/ExploreLifeLanguage.jsx"
    "app/Console/Commands/RemapExploreCopy.php"
)
mkdir -p "$BACKUP/staged" "$BACKUP/original"
echo "Резервная копия: $BACKUP"
for file in "${FILES[@]}"; do
    mkdir -p "$BACKUP/staged/$(dirname "$file")"
    git show "origin/main:$file" > "$BACKUP/staged/$file"
    if [[ "$file" == *.php ]]; then
        php -l "$BACKUP/staged/$file" >/dev/null
    fi
    if [ -f "$file" ]; then
        mkdir -p "$BACKUP/original/$(dirname "$file")"
        cp -a "$file" "$BACKUP/original/$file"
    fi
done
if [ -d public/build ]; then cp -a public/build "$BACKUP/build"; fi
if [ -f resources/data/explore-copy-manifest.json ]; then
    cp -a resources/data/explore-copy-manifest.json "$BACKUP/manifest.json"
fi
rollback() {
    result=$?
    trap - ERR
    echo "Ошибка ($result). Восстанавливаем прежний код..." >&2
    for file in "${FILES[@]}"; do
        if [ -f "$BACKUP/original/$file" ]; then
            cp -a "$BACKUP/original/$file" "$file"
        else
            rm -f "$file"
        fi
    done
    if [ -f "$BACKUP/manifest.json" ]; then
        cp -a "$BACKUP/manifest.json" resources/data/explore-copy-manifest.json
    fi
    if [ -d "$BACKUP/build" ]; then
        rm -rf public/build
        cp -a "$BACKUP/build" public/build
    fi
    php artisan optimize:clear || true
    exit "$result"
}
trap rollback ERR
for file in "${FILES[@]}"; do
    mkdir -p "$(dirname "$file")"
    cp -a "$BACKUP/staged/$file" "$file"
done
echo "Проверяем и собираем frontend..."
node scripts/generate-explore-copy-manifest.cjs
node scripts/verify-explore-cms.cjs
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json
if [ -f "$BACKUP/manifest.json" ]; then
    php artisan explore:remap-copy "$BACKUP/manifest.json" resources/data/explore-copy-manifest.json
fi
php artisan db:seed --class=ExploreContentSeeder --force
if [ ! -e public/storage ]; then
    php artisan storage:link
fi
php artisan optimize:clear
trap - ERR
echo "Готово: обложки внутри девяти направлений доступны в редакторе страниц."
echo "Админка: https://arutyun.me/gods"
echo "Резервная копия: $BACKUP"
