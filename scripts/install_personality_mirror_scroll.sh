#!/usr/bin/env bash
# Update only the personality-mirror scroll behavior without losing CMS edits.
set -Eeuo pipefail
cd /var/www/dato
BACKUP="/root/backups/personality-mirror-scroll-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP"
PAGE="resources/js/Pages/ExplorePersonalityMirror.jsx"
COMMAND="app/Console/Commands/RemapExploreCopy.php"
cp -a "$PAGE" "$BACKUP/ExplorePersonalityMirror.jsx"
if [ -f "$COMMAND" ]; then cp -a "$COMMAND" "$BACKUP/RemapExploreCopy.php"; fi
if [ -f resources/data/explore-copy-manifest.json ]; then
  cp -a resources/data/explore-copy-manifest.json "$BACKUP/explore-copy-manifest.json"
fi
if [ -d public/build ]; then cp -a public/build "$BACKUP/build"; fi
rollback() {
  code=$?
  trap - ERR
  echo "Ошибка обновления. Восстанавливаем файлы и сборку..." >&2
  cp -a "$BACKUP/ExplorePersonalityMirror.jsx" "$PAGE"
  if [ -f "$BACKUP/RemapExploreCopy.php" ]; then cp -a "$BACKUP/RemapExploreCopy.php" "$COMMAND"; else rm -f "$COMMAND"; fi
  if [ -f "$BACKUP/explore-copy-manifest.json" ]; then cp -a "$BACKUP/explore-copy-manifest.json" resources/data/explore-copy-manifest.json; fi
  if [ -d "$BACKUP/build" ]; then
    rm -rf public/build
    cp -a "$BACKUP/build" public/build
  fi
  php artisan optimize:clear || true
  echo "Восстановлено. Резервная копия: $BACKUP" >&2
  exit "$code"
}
trap rollback ERR
git show origin/main:"$PAGE" > "$PAGE"
mkdir -p "$(dirname "$COMMAND")"
git show origin/main:"$COMMAND" > "$COMMAND"
php -l "$COMMAND" >/dev/null
node scripts/generate-explore-copy-manifest.cjs
node scripts/verify-explore-cms.cjs
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json
if [ -f "$BACKUP/explore-copy-manifest.json" ]; then
  php artisan explore:remap-copy "$BACKUP/explore-copy-manifest.json" resources/data/explore-copy-manifest.json
fi
php artisan db:seed --class=ExploreContentSeeder --force
php artisan optimize:clear
trap - ERR
echo "Готово. На следующей грани прокрутка возвращается к первому вопросу."
echo "Резервная копия: $BACKUP"
