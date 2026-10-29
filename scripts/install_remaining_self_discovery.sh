#!/usr/bin/env bash
# Publish Dreams, Repetitions and Personality Mirror without overwriting unrelated local code.
# Requires repository origin/main, npm, PHP, Laravel. Run under tmux.
set -Eeuo pipefail
cd /var/www/dato
REF="origin/main"
BACKUP="/root/backups/self-discovery-remaining-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP/staged" "$BACKUP/existing"
FILES=(
  "routes/web.php"
  "database/seeders/PublishRemainingExploreToolsSeeder.php"
  "resources/js/Pages/ExploreDreams.jsx"
  "resources/js/Pages/ExploreDreamSymbol.jsx"
  "resources/js/Pages/ExplorePatterns.jsx"
  "resources/js/Pages/ExplorePatternDetail.jsx"
  "resources/js/Pages/ExplorePersonalityMirror.jsx"
    "resources/data/dream-atlas.json"
  "resources/data/pattern-atlas.json"
  "resources/data/personality-mirror.json"
)
echo "Резервная копия: $BACKUP"
echo "Загружаем и проверяем новую версию до изменений сайта..."
for f in "${FILES[@]}"; do
  mkdir -p "$BACKUP/staged/$(dirname "$f")"
  git show "$REF:$f" > "$BACKUP/staged/$f"
done
php -l "$BACKUP/staged/routes/web.php"
php -l "$BACKUP/staged/database/seeders/PublishRemainingExploreToolsSeeder.php"
python3 - "$BACKUP/staged" <<'PY'
import json, pathlib, sys
root=pathlib.Path(sys.argv[1])/'resources'/'data'
load=lambda n:json.loads((root/n).read_text(encoding='utf-8'))
dream=load('dream-atlas.json')
patterns=load('pattern-atlas.json')
mirror=load('personality-mirror.json')
assert len(dream['symbols'])==24 and len({s['slug'] for s in dream['symbols']})==24
assert len(dream['groups'])==4
assert all(len(s['questions'])==3 for s in dream['symbols'])
assert len(patterns['patterns'])==18 and len({p['slug'] for p in patterns['patterns']})==18
assert len(patterns['categories'])==6
assert all(len(p['questions'])==3 for p in patterns['patterns'])
assert len(mirror['axes'])==6 and len(mirror['questions'])==24
assert len(mirror['prompts'])==30 and len(mirror['dilemmas'])==12
assert len({q['id'] for q in mirror['questions']})==24
assert all(sum(q['axis']==a['slug'] for q in mirror['questions'])==4 for a in mirror['axes'])
assert all(len(d['options'])==2 for d in mirror['dilemmas'])
print('Данные проверены: 24 образа, 18 сценариев, 24 вопроса, 30 вопросов дня, 12 дилемм.')
PY

# Never overwrite route changes made locally on the server.
python3 - "$BACKUP/staged/routes/web.php" "routes/web.php" "$BACKUP/routes.web.new" <<'PY'
import pathlib,sys
source=pathlib.Path(sys.argv[1]).read_text(encoding='utf-8')
old=pathlib.Path(sys.argv[2]).read_text(encoding='utf-8')
block_start="// Self-discovery explorations without personal data storage."
next_route="Route::get('/numbers'"
i=source.find(block_start)
j=source.find(next_route,i)
assert i>=0 and j>i, "Не удалось выделить новые маршруты из GitHub"
block=source[i:j]
if block_start in old:
    assert block in old, "Локальные маршруты этих страниц отличаются. Не перезаписываем вручную изменённый код."
    merged=old
    print('Маршруты уже установлены.')
else:
    for needle in ["Route::get('/explore/dreams'", "Route::get('/explore/patterns'", "Route::get('/explore/mirror'"]:
        assert needle not in old, 'Обнаружен похожий локальный маршрут. Установка остановлена.'
    anchor=old.find(next_route)
    assert anchor>=0, 'В существующих маршрутах нет ожидаемой точки вставки'
    merged=old[:anchor]+block+old[anchor:]
    print('Добавлены маршруты новых разделов, остальные маршруты не изменены.')
pathlib.Path(sys.argv[3]).write_text(merged,encoding='utf-8')
PY
php -l "$BACKUP/routes.web.new"

echo "Сохраняем предыдущие файлы и сборку..."
for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    mkdir -p "$BACKUP/existing/$(dirname "$f")"
    cp -a "$f" "$BACKUP/existing/$f"
  else
    printf '%s\n' "$f" >> "$BACKUP/new-files.txt"
  fi
done
if [ -d public/build ]; then cp -a public/build "$BACKUP/build"; fi

rollback() {
  code=$?
  trap - ERR
  echo "Ошибка установки (код $code). Восстанавливаем рабочую версию..." >&2
  for f in "${FILES[@]}"; do
    if [ -f "$BACKUP/existing/$f" ]; then
      mkdir -p "$(dirname "$f")"
      cp -a "$BACKUP/existing/$f" "$f"
    else
      rm -f -- "$f"
    fi
  done
  if [ -d "$BACKUP/build" ]; then
    if [ -d public/build ]; then mv public/build "$BACKUP/build.failed"; fi
    cp -a "$BACKUP/build" public/build
  fi
  php artisan optimize:clear || true
  echo "Откат выполнен. Резервная копия: $BACKUP" >&2
  exit "$code"
}
trap rollback ERR
for f in "${FILES[@]}"; do
  if [ "$f" != "routes/web.php" ]; then
    mkdir -p "$(dirname "$f")"
    cp -a "$BACKUP/staged/$f" "$f"
  fi
done
cp -a "$BACKUP/routes.web.new" routes/web.php
php -l routes/web.php

echo "Собираем JavaScript (ограничение памяти для небольшого VPS)..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json
php artisan optimize:clear
php artisan route:list --path=explore/dreams
php artisan route:list --path=explore/patterns
php artisan route:list --path=explore/mirror

echo "Публикуем ровно три новых направления в каталоге..."
php artisan db:seed --class=PublishRemainingExploreToolsSeeder --force

trap - ERR
echo "Новые направления опубликованы."
echo "Резервная копия: $BACKUP"
echo "Проверь: /explore, /explore/dreams, /explore/patterns и /explore/mirror"
