#!/usr/bin/env bash
# Install the corrected scenario-specific branching for Language of Repetition.
# Only two frontend/data files are replaced. No .env, database, routes or bot changes.
set -Eeuo pipefail
cd /var/www/dato
REF="origin/main"
BACKUP="/root/backups/pattern-outcome-branches-$(date +%Y%m%d-%H%M%S)"
FILES=(
  "resources/data/pattern-atlas.json"
  "resources/js/Pages/ExplorePatterns.jsx"
)
mkdir -p "$BACKUP/staged" "$BACKUP/existing"

echo "Подготавливаем исправление..."
for file in "${FILES[@]}"; do
  mkdir -p "$BACKUP/staged/$(dirname "$file")"
  git show "$REF:$file" > "$BACKUP/staged/$file"
done

python3 - "$BACKUP/staged/resources/data/pattern-atlas.json" "$BACKUP/staged/resources/js/Pages/ExplorePatterns.jsx" <<'PY'
import json, pathlib, sys
atlas=json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
code=pathlib.Path(sys.argv[2]).read_text(encoding='utf-8')
patterns=atlas.get('patterns', [])
assert len(patterns)==18, 'Ожидаются 18 сценариев'
assert len({p['slug'] for p in patterns})==18, 'Сценарии должны быть уникальными'
count=0
for pattern in patterns:
    branches=pattern.get('outcomes',[])
    assert len(branches)==4, 'Нужно 4 исхода: '+pattern['slug']
    assert len({b['id'] for b in branches})==4, 'Исходы должны быть уникальны'
    for key in ('title','impact','insight','next','question'):
        values=[b.get(key,'').strip() for b in branches]
        assert all(values), 'Отсутствует поле: '+pattern['slug']+':'+key
        assert len(set(values))==4, 'Повторяющийся текст: '+pattern['slug']+':'+key
    count+=len(branches)
assert 'picked.outcomes.map' in code, 'Интерфейс не использует собственные исходы'
assert all(('result.'+key) in code for key in ('title','impact','insight','next','question')), 'Неполная связка итогов'
assert 'result.summary' not in code, 'Остался старый общий результат'
print(f'Проверено: {len(patterns)} сценариев, {count} разных исходов.')
PY

echo "Создаём резервную копию файлов и текущего интерфейса..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    mkdir -p "$BACKUP/existing/$(dirname "$file")"
    cp -a "$file" "$BACKUP/existing/$file"
  else
    echo "Отсутствует прежний файл: $file" >&2
    exit 1
  fi
done
if [ -d public/build ]; then cp -a public/build "$BACKUP/build"; fi

rollback() {
  status=$?
  trap - ERR
  echo "Ошибка обновления. Возвращаем старую версию..." >&2
  for file in "${FILES[@]}"; do
    cp -a "$BACKUP/existing/$file" "$file"
  done
  if [ -d "$BACKUP/build" ]; then
    if [ -d public/build ]; then mv public/build "$BACKUP/build.failed"; fi
    cp -a "$BACKUP/build" public/build
  fi
  echo "Откат выполнен. Копия: $BACKUP" >&2
  exit "$status"
}
trap rollback ERR

for file in "${FILES[@]}"; do cp -a "$BACKUP/staged/$file" "$file"; done
echo "Пересобираем интерфейс..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json

trap - ERR
echo "Готово: все четыре выбора в карте повторений дают собственный разбор."
echo "Резервная копия: $BACKUP"
echo "Проверь: https://arutyun.me/explore/patterns#map"
