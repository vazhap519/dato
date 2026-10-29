#!/usr/bin/env bash
# Deploy only the Numbers page header; preserve other site and server changes.
set -Eeuo pipefail

cd /var/www/dato
FILE="resources/js/Pages/Numbers.jsx"
BACKUP="/root/backups/numbers-header-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP"

git show "origin/main:$FILE" > "$BACKUP/Numbers.jsx.new"
grep -q 'Навигация по странице' "$BACKUP/Numbers.jsx.new"
grep -q 'href="#number-clock"' "$BACKUP/Numbers.jsx.new"
grep -q 'href="#catalog"' "$BACKUP/Numbers.jsx.new"
grep -q 'data-analytics="Числа · перейти к практикуму"' "$BACKUP/Numbers.jsx.new"

cp -a "$FILE" "$BACKUP/Numbers.jsx.old"
if [ -d public/build ]; then
  cp -a public/build "$BACKUP/build"
fi

rollback() {
  status=$?
  trap - ERR
  echo "Ошибка во время сборки. Восстанавливаем прежнюю версию..." >&2
  cp -a "$BACKUP/Numbers.jsx.old" "$FILE"
  if [ -d "$BACKUP/build" ]; then
    if [ -d public/build ]; then
      mv public/build "$BACKUP/build.failed"
    fi
    cp -a "$BACKUP/build" public/build
  fi
  echo "Прежняя версия восстановлена. Копия: $BACKUP" >&2
  exit "$status"
}
trap rollback ERR

cp -a "$BACKUP/Numbers.jsx.new" "$FILE"
echo "Обновляем сборку интерфейса..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json

trap - ERR
echo "Готово. Шапка «Языка чисел» обновлена."
echo "Резервная копия: $BACKUP"
