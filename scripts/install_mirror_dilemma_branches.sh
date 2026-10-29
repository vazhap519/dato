#!/usr/bin/env bash
# Focused update of the twelve personality-mirror dilemmas.
set -Eeuo pipefail
cd /var/www/dato

BACKUP="/root/backups/mirror-dilemmas-$(date +%Y%m%d-%H%M%S)"
FILES=(
  "resources/data/personality-mirror.json"
  "resources/js/Pages/ExplorePersonalityMirror.jsx"
)
mkdir -p "$BACKUP/staged" "$BACKUP/existing"

echo "Подготавливаем новые файлы..."
for file in "${FILES[@]}"; do
  mkdir -p "$BACKUP/staged/$(dirname "$file")"
  git show "origin/main:$file" > "$BACKUP/staged/$file"
done

python3 - "$BACKUP/staged" <<'PY'
import json, pathlib, sys
root = pathlib.Path(sys.argv[1])
atlas = json.loads((root / 'resources/data/personality-mirror.json').read_text(encoding='utf-8'))
page = (root / 'resources/js/Pages/ExplorePersonalityMirror.jsx').read_text(encoding='utf-8')
ds = atlas['dilemmas']
assert len(ds) == 12, 'Должно быть 12 дилемм'
assert len({d['id'] for d in ds}) == 12, 'Повторяются ID дилемм'
for dilemma in ds:
    options, responses = dilemma['options'], dilemma.get('responses', [])
    assert len(options) == 2 and len(responses) == 2, 'Неверное число вариантов: ' + dilemma['id']
    for key in ('title','value','risk','question','next'):
        values = [r.get(key, '').strip() for r in responses]
        assert len(set(values)) == 2 and all(values), 'Варианты не отличаются: '+dilemma['id']+'/'+key
for field in ('title','value','risk','question','next'):
    assert 'feedback.'+field in page, 'Интерфейс не показывает поле '+field
assert 'd.responses?.[dilemmaChoice]' in page, 'Разбор не зависит от выбранного ответа'
assert '{d.question}' not in page, 'В интерфейсе остался общий вопрос'
print('Проверено: 12 дилемм, 24 уникальных разбора.')
PY

echo "Резервное копирование..."
for file in "${FILES[@]}"; do
  test -f "$file"
  mkdir -p "$BACKUP/existing/$(dirname "$file")"
  cp -a "$file" "$BACKUP/existing/$file"
done
if [ -d public/build ]; then cp -a public/build "$BACKUP/build"; fi

rollback() {
  code=$?
  trap - ERR
  echo "Ошибка. Возвращаем предыдущую версию..." >&2
  for file in "${FILES[@]}"; do
    cp -a "$BACKUP/existing/$file" "$file"
  done
  if [ -d "$BACKUP/build" ]; then
    if [ -d public/build ]; then mv public/build "$BACKUP/failed-build"; fi
    cp -a "$BACKUP/build" public/build
  fi
  echo "Откат выполнен. Резервная копия: $BACKUP" >&2
  exit "$code"
}
trap rollback ERR

for file in "${FILES[@]}"; do
  cp -a "$BACKUP/staged/$file" "$file"
done

echo "Сборка интерфейса..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json
if ! grep -qFl --include='*.js' -r 'Разбор выбранного варианта' public/build/assets; then
  echo "Не найдена новая версия в собранном JavaScript." >&2
  exit 1
fi

trap - ERR
echo "Готово: 24 разных ответа на 12 жизненных дилемм."
echo "Резервная копия: $BACKUP"
echo "Проверь: https://arutyun.me/explore/mirror#dilemmas"
