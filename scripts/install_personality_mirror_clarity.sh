#!/usr/bin/env bash
# Remove the disconnected "six dimensions" block from Personality Mirror.
# Install only the page JSX, retaining quiz answers, dilemma data and all server settings.
set -Eeuo pipefail
cd /var/www/dato
FILE="resources/js/Pages/ExplorePersonalityMirror.jsx"
BACKUP="/root/backups/personality-mirror-clarity-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP"

echo "Подготавливаем обновлённую страницу..."
git show "origin/main:$FILE" > "$BACKUP/ExplorePersonalityMirror.jsx.new"
python3 - "$BACKUP/ExplorePersonalityMirror.jsx.new" <<'PY'
from pathlib import Path
import sys
c=Path(sys.argv[1]).read_text(encoding='utf-8')
assert 'Какие способы мы сравниваем?' in c
assert 'Тема {section+1} из {axes.length}' in c
assert 'Каждая строка ниже — результат четырёх вопросов' in c
assert 'id="dimensions"' not in c and 'href="#dimensions"' not in c
for marker in ['calculateScores(answers)', 'currentQuestions.map', 'scores.map',
               'data.dilemmas.map', 'feedback.question', 'feedback.next']:
    assert marker in c, f'Пропала часть работающего теста: {marker}'
print("Проверка интерфейса: объяснения встроены, отдельный блок убран, тест и дилеммы сохранены.")
PY

echo "Создаём резервную копию страницы и сборки..."
test -f "$FILE"
cp -a "$FILE" "$BACKUP/ExplorePersonalityMirror.jsx.old"
if [ -d public/build ]; then cp -a public/build "$BACKUP/build"; fi

rollback() {
  status=$?
  trap - ERR
  echo "Ошибка обновления. Возвращаем предыдущую версию..." >&2
  cp -a "$BACKUP/ExplorePersonalityMirror.jsx.old" "$FILE"
  if [ -d "$BACKUP/build" ]; then
    if [ -d public/build ]; then mv public/build "$BACKUP/build.failed"; fi
    cp -a "$BACKUP/build" public/build
  fi
  echo "Откат завершён. Папка копии: $BACKUP" >&2
  exit "$status"
}
trap rollback ERR

cp -a "$BACKUP/ExplorePersonalityMirror.jsx.new" "$FILE"
echo "Пересобираем интерфейс..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json
if ! grep -rqFl --include='*.js' 'Какие способы мы сравниваем?' public/build/assets; then
  echo "Новый текст не обнаружен в собранном JavaScript." >&2
  exit 1
fi

trap - ERR
echo "Готово! Блок встроен в тест и результаты. Резервная копия: $BACKUP"
echo "Открой: https://arutyun.me/explore/mirror#mirror"
