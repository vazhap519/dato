#!/usr/bin/env bash
# Safe selective deploy for the expanded archetype explorer.
# Does not touch .env, the database, the bot or unrelated local files.
set -Eeuo pipefail

cd /var/www/dato
REF="origin/main"
BACKUP="/root/backups/archetypes-explorer-v2-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP/staged" "$BACKUP/existing"
FILES=(
    "routes/web.php"
    "resources/js/Pages/ExploreArchetypes.jsx"
    "resources/js/Pages/ExploreArchetypeMirror.jsx"
    "resources/js/Pages/ExploreArchetypeDetail.jsx"
    "resources/js/Pages/ExploreArchetypeJournal.jsx"
    "resources/js/components/ArchetypeSituationExperience.jsx"
    "resources/js/components/ArchetypeJournalPanel.jsx"
    "resources/js/lib/archetypeJournal.js"
    "resources/data/archetype-guides.json"
    "resources/data/archetype-situations.json"
)
printf 'Резервная копия: %s\n' "$BACKUP"
printf 'Подготавливаем файлы из %s...\n' "$REF"

# Fetch and validate all files first, before changing anything on the live site.
for file in "${FILES[@]}"; do
    mkdir -p "$BACKUP/staged/$(dirname "$file")"
    git show "$REF:$file" > "$BACKUP/staged/$file"
done
php -l "$BACKUP/staged/routes/web.php"

python3 - "$BACKUP/staged" <<'PY'
import json, pathlib, sys
root = pathlib.Path(sys.argv[1]) / 'resources' / 'data'
guides = json.loads((root / 'archetype-guides.json').read_text(encoding='utf-8'))['guides']
situations = json.loads((root / 'archetype-situations.json').read_text(encoding='utf-8'))['situations']
assert len(guides) == 8, 'Нужно ровно 8 архетипов'
assert len(situations) == 28, 'Нужно ровно 28 ситуаций'
assert len({s['id'] for s in situations}) == 28, 'Повторяющиеся ситуации'
for situation in situations:
    assert len(situation['options']) == 4, 'Ожидались 4 варианта'
    assert all(o['slug'] in guides for o in situation['options']), 'Неизвестный архетип'
print('Данные проверены: 8 архетипов, 28 ситуаций.')
PY

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
    printf '\nОшибка установки (код %s). Восстанавливаем прежние файлы...\n' "$status" >&2
    for file in "${FILES[@]}"; do
        if [ -f "$BACKUP/existing/$file" ]; then
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
    printf 'Откат выполнен. Папка копии: %s\n' "$BACKUP" >&2
    exit "$status"
}
trap rollback ERR

for file in "${FILES[@]}"; do
    mkdir -p "$(dirname "$file")"
    cp -a "$BACKUP/staged/$file" "$file"
done

echo 'Собираем интерфейс (при отключении SSH продолжается в tmux)...'
NODE_OPTIONS="--max-old-space-size=768" npm run build
php artisan optimize:clear
php artisan route:list --path=explore/archetypes

trap - ERR
printf '\nУстановка завершена. Копия старой версии: %s\n' "$BACKUP"
printf 'Проверьте /explore/archetypes, /explore/archetypes/journal и карточки архетипов.\n'
