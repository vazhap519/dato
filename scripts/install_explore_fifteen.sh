#!/usr/bin/env bash
# Safe installation: 4 new topics + 15-topic semantic links.
# Re-includes the prior five topic files so this also works when their
# earlier installer was not run. No changes to .env or Telegram services.
set -Eeuo pipefail
cd /var/www/dato
REF=origin/main
BACKUP="/root/backups/explore-fifteen-$(date +%Y%m%d-%H%M%S)"
FILES=(
  "resources/js/app.jsx"
  "resources/js/Pages/Explore.jsx"
  "resources/js/Pages/ExploreLifeLanguage.jsx"
  "resources/js/components/ExploreConnections.jsx"
  "resources/js/components/ExploreLifeWorkbench.jsx"
  "resources/js/components/ExploreJourney.jsx"
  "resources/js/components/ExploreInvitation.jsx"
  "resources/data/relationships-atlas.json"
  "resources/data/body-atlas.json"
  "resources/data/choice-atlas.json"
  "resources/data/beliefs-atlas.json"
  "resources/data/values-atlas.json"
  "resources/data/fears-atlas.json"
  "resources/data/time-atlas.json"
  "resources/data/conflicts-atlas.json"
  "resources/data/attention-atlas.json"
  "app/Support/ExploreContent.php"
  "app/Filament/Resources/ExploreContentPages/ExploreContentPageResource.php"
  "app/Filament/Pages/SiteAnalytics.php"
  "routes/web.php"
  "database/seeders/ExploreNewLanguagesSeeder.php"
  "scripts/explore-copy-config.cjs"
  "scripts/verify-explore-cms.cjs"
  "app/Console/Commands/RemapExploreCopy.php"
)
mkdir -p "$BACKUP/original" "$BACKUP/staged"
echo "Резервная копия: $BACKUP"
for file in "${FILES[@]}"; do
  mkdir -p "$BACKUP/staged/$(dirname "$file")"
  git show "$REF:$file" > "$BACKUP/staged/$file"
  case "$file" in
    *.php) php -l "$BACKUP/staged/$file" >/dev/null ;;
    *.json) python3 -m json.tool "$BACKUP/staged/$file" >/dev/null ;;
    *.cjs) node --check "$BACKUP/staged/$file" ;;
  esac
  if [ -f "$file" ]; then
    mkdir -p "$BACKUP/original/$(dirname "$file")"
    cp -a "$file" "$BACKUP/original/$file"
  fi
done
if [ -f resources/data/explore-copy-manifest.json ]; then
  cp -a resources/data/explore-copy-manifest.json "$BACKUP/explore-copy-manifest.json"
fi
if [ -d public/build ]; then cp -a public/build "$BACKUP/build"; fi
rollback() {
  status=$?
  trap - ERR
  echo "Ошибка ($status). Возвращаем файлы и frontend..." >&2
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
  echo "Откат кода завершён. Если база успела пополниться, старые записи не изменены." >&2
  echo "Резервная копия: $BACKUP" >&2
  exit "$status"
}
trap rollback ERR
for file in "${FILES[@]}"; do
  mkdir -p "$(dirname "$file")"
  cp -a "$BACKUP/staged/$file" "$file"
done
echo "Проверяем редактор и справочники..."
node scripts/generate-explore-copy-manifest.cjs
node scripts/verify-explore-cms.cjs
echo "Собираем новый frontend..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json
if [ -f "$BACKUP/explore-copy-manifest.json" ]; then
  echo "Переносим ранее отредактированные тексты по новым ключам..."
  php artisan explore:remap-copy "$BACKUP/explore-copy-manifest.json" resources/data/explore-copy-manifest.json
fi
echo "Подключаем новые поля без перезаписи старого содержимого..."
php artisan db:seed --class=ExploreContentSeeder --force
echo "Добавляем девять новых направлений, если их ещё нет..."
php artisan db:seed --class=ExploreNewLanguagesSeeder --force
echo "Проверяем маршруты Laravel..."
php artisan optimize:clear
php artisan route:list --path=explore --json > "$BACKUP/explore-routes.json"
python3 - "$BACKUP/explore-routes.json" <<'PY'
import json
import sys
with open(sys.argv[1], encoding='utf-8') as source:
    routes = json.load(source)
expected = {
    "relationships", "body", "choice", "beliefs", "values",
    "fears", "time", "conflicts", "attention",
}
actual = {item.get("uri", "").strip("/") for item in routes}
missing = sorted("explore/" + slug for slug in expected if "explore/" + slug not in actual)
if missing:
    sys.exit("Отсутствуют маршруты: " + ", ".join(missing))
print("Проверка успешна: все девять новых маршрутов зарегистрированы.")
PY
trap - ERR
echo "Готово: 15 направлений, 4 новые страницы и переходы между всеми темами."
echo "Каталог: https://arutyun.me/explore"
echo "Админка: https://arutyun.me/gods"
echo "Резервная копия: $BACKUP"
