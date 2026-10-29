#!/usr/bin/env bash
# Repair misaligned icon glyphs in the shared mobile navigation on six pages.
# Only one React component is changed. No .env, database, routes or other pages.
set -Eeuo pipefail
cd /var/www/dato

FILE="resources/js/components/ExploreSectionNavigation.jsx"
BACKUP="/root/backups/explore-menu-svg-icons-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP"

echo "Загружаем исправленный компонент меню..."
git show "origin/main:$FILE" > "$BACKUP/ExploreSectionNavigation.jsx.new"

python3 - "$BACKUP/ExploreSectionNavigation.jsx.new" <<'PY'
from pathlib import Path
import re,sys
content=Path(sys.argv[1]).read_text(encoding='utf-8')
assert "function NavIcon(" in content, 'Нет SVG-компонента'
assert '<svg aria-hidden="true"' in content, 'Отсутствуют SVG'
assert 'material-symbols-outlined' not in content, 'Остались иконки из шрифта'
assert 'xl:hidden' in content and 'xl:flex' in content, 'Повреждена адаптивная навигация'
assert 'aria-expanded={open}' in content, 'Повреждена кнопка'
assert "event.key === 'Escape'" in content, 'Повреждено закрытие Escape'
assert 'pointerdown' in content, 'Повреждено закрытие по клику'
assert 'item.onClick?.()' in content, 'Повреждены действия навигации'
expected={
    'search','schedule','auto_awesome','menu_book','grid_view','apps',
    'explore','help_outline','layers','forum','spa','bedtime','auto_stories',
    'wb_twilight','self_improvement','wb_sunny','psychology','route','repeat',
    'lightbulb','visibility','account_tree','balance','menu','close','check',
    'chevron-right','chevron-down','arrow-right','compass'
}
keys=set(re.findall(r"^\s*(?:'([^']+)'|([a-z_]+)):\s*<",content,re.M))
keys={a or b for a,b in keys}
assert expected<=keys, 'Нет SVG-иконок: '+str(sorted(expected-keys))
print('Проверено: 30 SVG-иконок, мобильное меню, навигация, закрытие.')
PY

echo "Сохраняем предыдущую версию компонента и сборку..."
if [ -f "$FILE" ]; then
  cp -a "$FILE" "$BACKUP/ExploreSectionNavigation.jsx.old"
fi
if [ -d public/build ]; then
  cp -a public/build "$BACKUP/build"
fi

rollback() {
  status=$?
  trap - ERR
  echo "Ошибка при обновлении. Возвращаем прежнюю версию..." >&2
  if [ -f "$BACKUP/ExploreSectionNavigation.jsx.old" ]; then
    cp -a "$BACKUP/ExploreSectionNavigation.jsx.old" "$FILE"
  else
    rm -f "$FILE"
  fi
  if [ -d "$BACKUP/build" ]; then
    if [ -d public/build ]; then mv public/build "$BACKUP/failed-build"; fi
    cp -a "$BACKUP/build" public/build
  fi
  echo "Откат завершён. Резервная копия: $BACKUP" >&2
  exit "$status"
}
trap rollback ERR

mkdir -p "$(dirname "$FILE")"
cp -a "$BACKUP/ExploreSectionNavigation.jsx.new" "$FILE"
echo "Обновляем production-сборку..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json

trap - ERR
echo "Готово: SVG-иконки в мобильном меню всех шести страниц."
echo "Резервная копия: $BACKUP"
echo "Проверь: https://arutyun.me/explore/dreams"
