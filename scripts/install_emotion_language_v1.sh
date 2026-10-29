#!/usr/bin/env bash
# Safe selective installer for the new Emotion Language explorer.
# Does not touch .env, personal data, the database, Telegram services or unrelated files.
set -Eeuo pipefail
cd /var/www/dato

BACKUP="/root/backups/emotion-language-$(date +%Y%m%d-%H%M%S)"
REF="origin/main"
FILES=(
  "routes/web.php"
  "resources/js/Pages/ExploreEmotions.jsx"
  "resources/js/Pages/ExploreEmotionDetail.jsx"
  "resources/js/components/EmotionCompass.jsx"
  "resources/js/components/EmotionNamingHelper.jsx"
  "resources/js/components/EmotionLayersExplorer.jsx"
  "resources/js/components/EmotionScenarioLibrary.jsx"
  "resources/js/components/EmotionPracticeLibrary.jsx"
  "resources/data/emotion-atlas.json"
  "resources/data/emotion-situations.json"
  "resources/data/emotion-practices.json"
)
mkdir -p "$BACKUP/staged" "$BACKUP/existing"

echo "Резервная копия: $BACKUP"
echo "Подготавливаем все файлы до изменения сайта..."
for file in "${FILES[@]}"; do
  mkdir -p "$BACKUP/staged/$(dirname "$file")"
  git show "$REF:$file" > "$BACKUP/staged/$file"
done
php -l "$BACKUP/staged/routes/web.php"

python3 - "$BACKUP/staged" <<'PY'
import json, pathlib, sys
root = pathlib.Path(sys.argv[1])
get = lambda n: json.loads((root / 'resources' / 'data' / n).read_text(encoding='utf-8'))
atlas = get('emotion-atlas.json')
scenes = get('emotion-situations.json')
practices = get('emotion-practices.json')
groups = {g['id'] for g in atlas['groups']}
emotions = {e['slug']: e for e in atlas['emotions']}
assert len(groups) == 4, 'Ожидаются 4 группы'
assert len(emotions) == 24 and len(atlas['emotions']) == 24, 'Ожидаются 24 уникальные эмоции'
for e in emotions.values():
    assert e['group'] in groups, 'Неизвестная группа'
    assert len(e['body']) == 3 and len(e['questions']) == 3
    assert all(slug in emotions for slug in e['related']), 'Неизвестная связанная эмоция'
    assert all(e['practices'][name] for name in ('soft','steady','strong'))
assert len(scenes['situations']) == 30, 'Ожидаются 30 ситуаций'
assert len({s['id'] for s in scenes['situations']}) == 30
assert len({c['id'] for c in scenes['categories']}) == 5
for s in scenes['situations']:
    assert len(s['options']) == 4 and all(slug in emotions for slug in s['options'])
assert len(practices['practices']) == 12, 'Ожидаются 12 практик'
assert len({p['id'] for p in practices['practices']}) == 12
print('Данные проверены: 24 состояния, 30 ситуаций, 12 практик.')
PY

echo "Сохраняем прежние файлы и сборку..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    mkdir -p "$BACKUP/existing/$(dirname "$file")"
    cp -a "$file" "$BACKUP/existing/$file"
  else
    printf '%s\n' "$file" >> "$BACKUP/new-files.txt"
  fi
done
if [ -d public/build ]; then
  cp -a public/build "$BACKUP/build"
fi

rollback() {
  status=$?
  trap - ERR
  echo "Ошибка установки (код $status). Восстанавливаем предыдущую версию..." >&2
  for file in "${FILES[@]}"; do
    if [ -f "$BACKUP/existing/$file" ]; then
      mkdir -p "$(dirname "$file")"
      cp -a "$BACKUP/existing/$file" "$file"
    else
      rm -f -- "$file"
    fi
  done
  if [ -d "$BACKUP/build" ]; then
    if [ -d public/build ]; then
      mv public/build "$BACKUP/failed-build"
    fi
    cp -a "$BACKUP/build" public/build
  fi
  php artisan optimize:clear || true
  echo "Откат завершён. Резервная копия: $BACKUP" >&2
  exit "$status"
}
trap rollback ERR

# Copy frontend and data only; preserve locally edited routes/web.php.
for file in "${FILES[@]}"; do
  if [ "$file" != 'routes/web.php' ]; then
    mkdir -p "$(dirname "$file")"
    cp -a "$BACKUP/staged/$file" "$file"
  fi
done

python3 - "$BACKUP/staged/routes/web.php" "routes/web.php" <<'PY'
import pathlib, sys
staged = pathlib.Path(sys.argv[1]).read_text(encoding='utf-8')
path = pathlib.Path(sys.argv[2])
live = path.read_text(encoding='utf-8')
base = "Route::get('/explore/emotions', fn () => Inertia::render('ExploreEmotions'))->name('explore.emotions');"
start = staged.find("Route::get('/explore/emotions/{slug}'")
end_token = "->name('explore.emotions.detail');"
end = staged.find(end_token, start)
assert start >= 0 and end >= 0 and base in live, 'Не найден ожидаемый маршрут эмоций'
block = staged[start:end + len(end_token)]
if "Route::get('/explore/emotions/{slug}'" in live:
    assert block in live, 'В маршруте эмоций есть локальные изменения; установка остановлена'
    print('Маршрут отдельных эмоций уже присутствует.')
else:
    path.write_text(live.replace(base, base + '\n' + block, 1), encoding='utf-8')
    print('Добавлен только новый маршрут; остальные локальные маршруты сохранены.')
PY

php -l routes/web.php
echo "Собираем обновлённый интерфейс..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
php artisan optimize:clear
php artisan route:list --path=explore/emotions

trap - ERR
echo "Установка завершена успешно."
echo "Резервная копия: $BACKUP"
echo "Проверь /explore/emotions и /explore/emotions/anger."
