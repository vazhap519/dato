#!/usr/bin/env bash
# Deploy Explore discovery, invitations and first-party funnel analytics.
# No .env changes, no database migrations, no Telegram service changes.
set -Eeuo pipefail
cd /var/www/dato

REF="origin/main"
BACKUP="/root/backups/explore-growth-$(date +%Y%m%d-%H%M%S)"
FILES=(
  "app/Http/Middleware/HandleInertiaRequests.php"
  "app/Http/Controllers/SiteAnalyticsController.php"
  "app/Filament/Pages/SiteAnalytics.php"
  "resources/views/filament/pages/site-analytics.blade.php"
  "resources/js/components/headerComponents/Navigation.jsx"
  "resources/js/components/SiteAnalytics.jsx"
  "resources/js/components/ExploreInvitation.jsx"
  "resources/js/components/ExploreJourney.jsx"
  "resources/js/components/EmotionCompass.jsx"
  "resources/js/components/ArchetypeSituationExperience.jsx"
  "resources/js/Pages/Home.jsx"
  "resources/js/Pages/Numbers.jsx"
  "resources/js/Pages/ExploreArchetypeMirror.jsx"
  "resources/js/Pages/ExplorePersonalityMirror.jsx"
  "resources/js/Pages/ExplorePatterns.jsx"
  "resources/js/Pages/ExploreDreams.jsx"
)
mkdir -p "$BACKUP/staged" "$BACKUP/original"
echo "Резервная копия: $BACKUP"

for file in "${FILES[@]}"; do
  mkdir -p "$BACKUP/staged/$(dirname "$file")"
  git show "$REF:$file" > "$BACKUP/staged/$file"
  case "$file" in
    *.php) php -l "$BACKUP/staged/$file" >/dev/null ;;
  esac
done

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    mkdir -p "$BACKUP/original/$(dirname "$file")"
    cp -a "$file" "$BACKUP/original/$file"
  fi
done

if [ -d public/build ]; then
  cp -a public/build "$BACKUP/build"
fi

rollback() {
  status=$?
  trap - ERR
  echo "Ошибка обновления ($status). Возвращаем прежние файлы и сборку." >&2
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
  echo "Откат завершён. Копия: $BACKUP" >&2
  exit "$status"
}
trap rollback ERR

for file in "${FILES[@]}"; do
  mkdir -p "$(dirname "$file")"
  cp -a "$BACKUP/staged/$file" "$file"
done

echo "Собираем новую версию..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json
echo "Очищаем кеш Laravel..."
php artisan optimize:clear

trap - ERR
echo "Обновление Explore и аналитики установлено."
echo "Главная: https://arutyun.me/"
echo "Раздел: https://arutyun.me/explore"
echo "Аналитика: https://arutyun.me/gods"
echo "Резервная копия: $BACKUP"
