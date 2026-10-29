#!/usr/bin/env bash
# Deploy only the mobile emotion-practice accordion.
# Does not change .env, the database, the Telegram bot or other site pages.
set -Eeuo pipefail
cd /var/www/dato

FILE="resources/js/components/EmotionPracticeLibrary.jsx"
BACKUP="/root/backups/emotion-practice-accordion-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP"

echo "Подготавливаем новую версию..."
git show "origin/main:$FILE" > "$BACKUP/EmotionPracticeLibrary.jsx.new"
grep -q 'aria-expanded={expanded}' "$BACKUP/EmotionPracticeLibrary.jsx.new"
grep -q 'lg:hidden' "$BACKUP/EmotionPracticeLibrary.jsx.new"
grep -q 'lg:grid' "$BACKUP/EmotionPracticeLibrary.jsx.new"

echo "Сохраняем прежние файлы и сборку..."
test -f "$FILE"
cp -a "$FILE" "$BACKUP/EmotionPracticeLibrary.jsx.old"
if [ -d public/build ]; then
  cp -a public/build "$BACKUP/build"
fi

rollback() {
  status=$?
  trap - ERR
  echo "Не удалось завершить обновление. Восстанавливаем старую версию..." >&2
  cp -a "$BACKUP/EmotionPracticeLibrary.jsx.old" "$FILE"
  if [ -d "$BACKUP/build" ]; then
    if [ -d public/build ]; then
      mv public/build "$BACKUP/build.failed"
    fi
    cp -a "$BACKUP/build" public/build
  fi
  echo "Старая версия восстановлена. Копия: $BACKUP" >&2
  exit "$status"
}
trap rollback ERR

cp -a "$BACKUP/EmotionPracticeLibrary.jsx.new" "$FILE"
echo "Пересобираем интерфейс..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json

trap - ERR
echo "Готово: практики раскрываются в карточках на мобильном экране."
echo "Резервная копия: $BACKUP"
