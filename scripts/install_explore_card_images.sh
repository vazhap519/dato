#!/usr/bin/env bash
# Install self-service images for the six Explore catalog cards.
# Does not alter .env, existing copy, migrations or Telegram services.
set -Eeuo pipefail
cd /var/www/dato
BACKUP="/root/backups/explore-card-images-$(date +%Y%m%d-%H%M%S)"
FILES=(
  "app/Filament/Resources/ExploreContentPages/ExploreContentPageResource.php"
  "routes/web.php"
  "resources/js/Pages/Explore.jsx"
)
mkdir -p "$BACKUP/original" "$BACKUP/staged"
for file in "${FILES[@]}"; do
  mkdir -p "$BACKUP/staged/$(dirname "$file")"
  git show origin/main:"$file" > "$BACKUP/staged/$file"
  if [[ "$file" == *.php ]]; then php -l "$BACKUP/staged/$file" >/dev/null; fi
  if [ -f "$file" ]; then
    mkdir -p "$BACKUP/original/$(dirname "$file")"
    cp -a "$file" "$BACKUP/original/$file"
  fi
done
if [ -d public/build ]; then cp -a public/build "$BACKUP/build"; fi
rollback() {
  code=$?
  trap - ERR
  echo "Ошибка; восстанавливаем прежние файлы и сборку..." >&2
  for file in "${FILES[@]}"; do
    if [ -f "$BACKUP/original/$file" ]; then
      cp -a "$BACKUP/original/$file" "$file"
    else
      rm -f "$file"
    fi
  done
  if [ -d "$BACKUP/build" ]; then
    rm -rf public/build
    cp -a "$BACKUP/build" public/build
  fi
  php artisan optimize:clear || true
  echo "Откат выполнен. Копия: $BACKUP" >&2
  exit "$code"
}
trap rollback ERR
for file in "${FILES[@]}"; do
  mkdir -p "$(dirname "$file")"
  cp -a "$BACKUP/staged/$file" "$file"
done
echo "Собираем frontend..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json
echo "Проверяем публичное хранилище..."
if [ ! -e public/storage ]; then
  php artisan storage:link
fi
echo "Очищаем Laravel и Filament кеш..."
php artisan optimize:clear
trap - ERR
echo "Карточки готовы к загрузке своих изображений."
echo "Админка: https://arutyun.me/gods"
echo "Самопознание → Тексты шести страниц → Общие элементы шести направлений"
echo "Сайт: https://arutyun.me/explore"
echo "Резервная копия: $BACKUP"
