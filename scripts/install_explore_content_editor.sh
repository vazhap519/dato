#!/usr/bin/env bash
# Safe initial install of Filament self-discovery content editor.
# Does not modify .env, routes/web.php, Telegram services, or existing data tables.
# Use inside the existing tmux session.
set -Eeuo pipefail
cd /var/www/dato

REF="origin/main"
BACKUP="/root/backups/explore-cms-$(date +%Y%m%d-%H%M%S)"
FILES=(
  "database/migrations/2026_10_30_210000_create_explore_content_editor_tables.php"
  "app/Models/ExploreContentPage.php"
  "app/Models/ExploreContentItem.php"
  "app/Support/ExploreContent.php"
  "app/Http/Middleware/HandleInertiaRequests.php"
  "database/seeders/ExploreContentSeeder.php"
  "app/Filament/Resources/ExploreContentPages/ExploreContentPageResource.php"
  "app/Filament/Resources/ExploreContentPages/Pages/ListExploreContentPages.php"
  "app/Filament/Resources/ExploreContentPages/Pages/EditExploreContentPage.php"
  "app/Filament/Resources/ExploreContentItems/ExploreContentItemResource.php"
  "app/Filament/Resources/ExploreContentItems/Pages/ListExploreContentItems.php"
  "app/Filament/Resources/ExploreContentItems/Pages/EditExploreContentItem.php"
  "app/Filament/Resources/NumberMeanings/NumberMeaningResource.php"
  "scripts/explore-copy-config.cjs"
  "scripts/explore-copy-babel.cjs"
  "scripts/generate-explore-copy-manifest.cjs"
  "scripts/verify-explore-cms.cjs"
  "resources/js/lib/exploreCms.js"
  "resources/js/app.jsx"
  "vite.config.js"
  "resources/js/Pages/ExploreEmotions.jsx"
  "resources/js/Pages/ExploreEmotionDetail.jsx"
  "resources/js/components/EmotionCompass.jsx"
  "resources/js/components/EmotionNamingHelper.jsx"
  "resources/js/components/EmotionLayersExplorer.jsx"
  "resources/js/components/EmotionScenarioLibrary.jsx"
  "resources/js/components/EmotionPracticeLibrary.jsx"
  "resources/js/Pages/ExploreArchetypes.jsx"
  "resources/js/components/ArchetypeSituationExperience.jsx"
  "resources/js/Pages/ExploreArchetypeMirror.jsx"
  "resources/js/Pages/ExploreDreams.jsx"
  "resources/js/Pages/ExploreDreamSymbol.jsx"
  "resources/js/Pages/ExplorePatterns.jsx"
  "resources/js/Pages/ExplorePatternDetail.jsx"
  "resources/js/Pages/ExplorePersonalityMirror.jsx"
)
mkdir -p "$BACKUP/staged" "$BACKUP/existing"
echo "Резервная копия: $BACKUP"
echo "Подготавливаем все файлы, не изменяя сайт..."
for file in "${FILES[@]}"; do
  mkdir -p "$BACKUP/staged/$(dirname "$file")"
  git show "$REF:$file" > "$BACKUP/staged/$file"
done

echo "Проверяем синтаксис PHP и Node..."
for file in "${FILES[@]}"; do
  case "$file" in
    *.php) php -l "$BACKUP/staged/$file" >/dev/null ;;
    *.cjs) node --check "$BACKUP/staged/$file" ;;
  esac
done
test -f "$BACKUP/staged/app/Support/ExploreContent.php"
test -f "$BACKUP/staged/resources/js/lib/exploreCms.js"

echo "Создаём резервную копию текущих файлов..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    mkdir -p "$BACKUP/existing/$(dirname "$file")"
    cp -a "$file" "$BACKUP/existing/$file"
  else
    echo "$file" >> "$BACKUP/new-files.txt"
  fi
done
if [ -f resources/data/explore-copy-manifest.json ]; then
  mkdir -p "$BACKUP/existing/resources/data"
  cp -a resources/data/explore-copy-manifest.json "$BACKUP/existing/resources/data/explore-copy-manifest.json"
fi
if [ -d public/build ]; then
  cp -a public/build "$BACKUP/build"
fi

rollback() {
  code=$?
  trap - ERR
  echo "Ошибка установки (код $code): восстанавливаем код и сборку..." >&2
  for file in "${FILES[@]}"; do
    if [ -f "$BACKUP/existing/$file" ]; then
      mkdir -p "$(dirname "$file")"
      cp -a "$BACKUP/existing/$file" "$file"
    else
      rm -f -- "$file"
    fi
  done
  if [ -f "$BACKUP/existing/resources/data/explore-copy-manifest.json" ]; then
    cp -a "$BACKUP/existing/resources/data/explore-copy-manifest.json" resources/data/explore-copy-manifest.json
  else
    rm -f resources/data/explore-copy-manifest.json
  fi
  if [ -d "$BACKUP/build" ]; then
    if [ -d public/build ]; then mv public/build "$BACKUP/build.failed"; fi
    cp -a "$BACKUP/build" public/build
  fi
  php artisan optimize:clear || true
  echo "Код и сборка восстановлены. Резервная копия: $BACKUP" >&2
  echo "Если миграция успела создать новые таблицы, они сохранятся, но не затрагивают старые данные." >&2
  exit "$code"
}
trap rollback ERR

echo "Копируем новую CMS и только связанные с ней файлы..."
for file in "${FILES[@]}"; do
  mkdir -p "$(dirname "$file")"
  cp -a "$BACKUP/staged/$file" "$file"
done

echo "Извлекаем уже существующие тексты страниц в поля админки..."
node scripts/generate-explore-copy-manifest.cjs
node scripts/verify-explore-cms.cjs

echo "Собираем интерфейс для чтения CMS из базы..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json
# Babel/minifiers may rename generated imports, so verify the transformed
# source keys rather than searching for an unstable identifier in minified JS.
node scripts/verify-explore-cms.cjs

echo "Создаём только две новые таблицы контента..."
php artisan migrate --path=database/migrations/2026_10_30_210000_create_explore_content_editor_tables.php --force

echo "Заполняем редактор исходными текстами. Ранее внесённые изменения сохраняются..."
php artisan db:seed --class=ExploreContentSeeder --force
php artisan optimize:clear

echo "Проверяем число доступных разделов и материалов..."
php artisan tinker --execute='
$p = \App\Models\ExploreContentPage::count();
$i = \App\Models\ExploreContentItem::count();
echo "Страниц и общих элементов: ".$p.PHP_EOL;
echo "Отдельных материалов: ".$i.PHP_EOL;
if ($p < 7 || $i < 130) { throw new \RuntimeException("Данные CMS заполнены не полностью"); }
'
trap - ERR
echo "CMS успешно установлен."
echo "Админка: https://arutyun.me/gods"
echo "В меню «Самопознание»: «Тексты шести страниц» и «Материалы и вопросы»."
echo "Резервная копия: $BACKUP"
