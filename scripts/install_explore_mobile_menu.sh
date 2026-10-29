#!/usr/bin/env bash
# Deploy a shared responsive header menu on six self-discovery landing pages.
# Only nav/header markup is patched in each page; other local page changes are preserved.
# No .env, database, routes, Filament, Telegram or migrations.
set -Eeuo pipefail
cd /var/www/dato
REF="origin/main"
BACKUP="/root/backups/explore-mobile-menu-$(date +%Y%m%d-%H%M%S)"
COMPONENT="resources/js/components/ExploreSectionNavigation.jsx"
PAGES=(
  "resources/js/Pages/Numbers.jsx"
  "resources/js/Pages/ExploreEmotions.jsx"
  "resources/js/Pages/ExploreDreams.jsx"
  "resources/js/Pages/ExploreArchetypes.jsx"
  "resources/js/Pages/ExplorePatterns.jsx"
  "resources/js/Pages/ExplorePersonalityMirror.jsx"
)
FILES=("$COMPONENT" "${PAGES[@]}")
mkdir -p "$BACKUP/staged" "$BACKUP/existing"

echo "Готовим мобильное меню для шести направлений..."
echo "Папка резервной копии: $BACKUP"
for file in "${FILES[@]}"; do
  mkdir -p "$BACKUP/staged/$(dirname "$file")"
  git show "$REF:$file" > "$BACKUP/staged/$file"
done

python3 - "$BACKUP/staged" <<'PY'
from pathlib import Path
import re,sys
root=Path(sys.argv[1])
component=(root/'resources/js/components/ExploreSectionNavigation.jsx').read_text(encoding='utf-8')
assert 'xl:hidden' in component and 'xl:flex' in component, 'Нет адаптивных режимов'
assert all(x in component for x in (
  'aria-expanded={open}', 'aria-controls={menuId}', "event.key === 'Escape'",
  'pointerdown', 'setOpen(false)', 'item.onClick?.()', 'Быстрая навигация',
  "href={item.href}"
)), 'В компоненте отсутствует важное поведение'
pages=[
 'Numbers.jsx','ExploreEmotions.jsx','ExploreDreams.jsx',
 'ExploreArchetypes.jsx','ExplorePatterns.jsx','ExplorePersonalityMirror.jsx'
]
for name in pages:
    page=(root/'resources/js/Pages'/name).read_text(encoding='utf-8')
    header=re.findall(r'<header\b[\s\S]*?</header>',page)
    assert len(header)==1, 'Не найдена шапка: '+name
    assert 'ExploreSectionNavigation items=' in header[0], 'Не найдено меню: '+name
    assert "import ExploreSectionNavigation from '../components/ExploreSectionNavigation';" in page
    links=set(re.findall(r"href:\s*'(#[a-z0-9-]+)'",header[0]))
    assert len(links)>=2, 'Слишком мало якорей: '+name
    for link in links:
        assert 'id="'+link[1:]+'"' in page, 'Нет раздела '+link+' в '+name
    print('Проверено:',name,'—',len(links),'переходов внутри страницы')
PY

echo "Копируем текущие файлы и готовую сборку..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    mkdir -p "$BACKUP/existing/$(dirname "$file")"
    cp -a "$file" "$BACKUP/existing/$file"
  elif [ "$file" = "$COMPONENT" ]; then
    echo "$file" >> "$BACKUP/new-files.txt"
  else
    echo "Не найден файл существующей страницы: $file" >&2
    exit 1
  fi
done
if [ -d public/build ]; then
  cp -a public/build "$BACKUP/build"
fi

rollback() {
  status=$?
  trap - ERR
  echo "Обновление прервано (код $status). Возвращаем предыдущую версию..." >&2
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
      mv public/build "$BACKUP/build.failed"
    fi
    cp -a "$BACKUP/build" public/build
  fi
  echo "Файлы и сборка восстановлены. Резервная копия: $BACKUP" >&2
  exit "$status"
}
trap rollback ERR

mkdir -p "$(dirname "$COMPONENT")"
cp -a "$BACKUP/staged/$COMPONENT" "$COMPONENT"

# On the server there can be uncommitted changes to page content.
# Replace only the header, keeping the rest of each live page intact.
python3 - "$BACKUP/staged" "${PAGES[@]}" <<'PY'
from pathlib import Path
import re,sys
root=Path(sys.argv[1])
pages=sys.argv[2:]
header_rx=re.compile(r'<header\b[\s\S]*?</header>')
import_line="import ExploreSectionNavigation from '../components/ExploreSectionNavigation';"
import_rx=re.compile(r'^import [^\n]+;$',re.M)
for raw_path in pages:
    path=Path(raw_path)
    staged=(root/path).read_text(encoding='utf-8')
    live=path.read_text(encoding='utf-8')
    target=header_rx.findall(staged)
    original=header_rx.findall(live)
    assert len(target)==1 and len(original)==1, 'Непредвиденная структура страницы: '+raw_path
    assert 'ExploreSectionNavigation items=' in target[0]
    updated=header_rx.sub(lambda _:target[0],live,count=1)
    if import_line not in updated:
        imports=list(import_rx.finditer(updated))
        assert imports, 'Нет области импортов: '+raw_path
        last=imports[-1]
        updated=updated[:last.end()]+'\n'+import_line+updated[last.end():]
    assert updated.count(import_line)==1, 'Дублирован импорт: '+raw_path
    path.write_text(updated,encoding='utf-8')
    print('Обновлена только шапка:',raw_path)
PY

echo "Собираем интерфейс..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json
if ! grep -rqFl --include='*.js' 'Быстрая навигация' public/build/assets; then
  echo "В собранных файлах не найдено новое мобильное меню." >&2
  exit 1
fi

trap - ERR
echo "Готово: все шесть страниц получили мобильное выпадающее меню."
echo "Резервная копия: $BACKUP"
echo "Проверь на телефоне /numbers и /explore/emotions, /explore/dreams,"
echo "/explore/archetypes, /explore/patterns, /explore/mirror"
