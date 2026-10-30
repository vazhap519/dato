#!/usr/bin/env bash
# Install five additional self-discovery tools with content editor support.
# Preserves .env, existing tool edits and existing PostgreSQL records.
set -Eeuo pipefail
cd /var/www/dato
REF=origin/main
BACKUP="/root/backups/explore-five-languages-$(date +%Y%m%d-%H%M%S)"
FILES=(
  "resources/js/Pages/ExploreLifeLanguage.jsx"
  "resources/js/Pages/Explore.jsx"
  "resources/js/components/ExploreJourney.jsx"
  "resources/js/components/ExploreInvitation.jsx"
  "resources/data/relationships-atlas.json"
  "resources/data/body-atlas.json"
  "resources/data/choice-atlas.json"
  "resources/data/beliefs-atlas.json"
  "resources/data/values-atlas.json"
  "app/Support/ExploreContent.php"
  "routes/web.php"
  "app/Filament/Resources/ExploreContentPages/ExploreContentPageResource.php"
  "app/Filament/Pages/SiteAnalytics.php"
  "database/seeders/ExploreNewLanguagesSeeder.php"
  "scripts/explore-copy-config.cjs"
  "app/Console/Commands/RemapExploreCopy.php"
)
mkdir -p "$BACKUP/original" "$BACKUP/staged"
echo "Резервная копия: $BACKUP"
for file in "${FILES[@]}"; do
  mkdir -p "$BACKUP/staged/$(dirname "$file")"
  git show "$REF:$file" > "$BACKUP/staged/$file"
  if [[ "$file" == *.php ]]; then php -l "$BACKUP/staged/$file" >/dev/null; fi
  if [ -f "$file" ]; then
    mkdir -p "$BACKUP/original/$(dirname "$file")"
    cp -a "$file" "$BACKUP/original/$file"
  fi
done
if [ -d public/build ]; then cp -a public/build "$BACKUP/build"; fi
if [ -f resources/data/explore-copy-manifest.json ]; then
  cp -a resources/data/explore-copy-manifest.json "$BACKUP/explore-copy-manifest.json"
fi

rollback() {
  status=$?
  trap - ERR
  echo "Ошибка ($status). Восстанавливаем файлы..." >&2
  for file in "${FILES[@]}"; do
    if [ -f "$BACKUP/original/$file" ]; then
      mkdir -p "$(dirname "$file")"
      cp -a "$BACKUP/original/$file" "$file"
    else
      rm -f "$file"
    fi
  done
  if [ -f "$BACKUP/explore-copy-manifest.json" ]; then
    cp -a "$BACKUP/explore-copy-manifest.json" resources/data/explore-copy-manifest.json
  fi
  if [ -d "$BACKUP/build" ]; then
    rm -rf public/build
    cp -a "$BACKUP/build" public/build
  fi
  php artisan optimize:clear || true
  echo "Код и frontend восстановлены. Новые записи в БД, если успели создаться, безопасны и не меняют старые данные." >&2
  echo "Резервная копия: $BACKUP" >&2
  exit "$status"
}
trap rollback ERR

for file in "${FILES[@]}"; do
  mkdir -p "$(dirname "$file")"
  cp -a "$BACKUP/staged/$file" "$file"
done

echo "Проверяем библиотеки и CMS..."
node scripts/generate-explore-copy-manifest.cjs
node scripts/verify-explore-cms.cjs
echo "Собираем сайт..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json

echo "Сохраняем связь ранее отредактированных текстов..."
if [ -f "$BACKUP/explore-copy-manifest.json" ]; then
  php artisan explore:remap-copy "$BACKUP/explore-copy-manifest.json" resources/data/explore-copy-manifest.json
fi
echo "Заполняем редактор без перезаписи авторских изменений..."
php artisan db:seed --class=ExploreContentSeeder --force
echo "Добавляем новые направления в каталог..."
php artisan db:seed --class=ExploreNewLanguagesSeeder --force
php artisan optimize:clear
trap - ERR
echo "Установка завершена: пять новых направлений опубликованы."
echo "Каталог: https://arutyun.me/explore"
echo "Админка: https://arutyun.me/gods"
echo "Резервная копия: $BACKUP"
