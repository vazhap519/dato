#!/usr/bin/env bash
set -Eeuo pipefail
cd /var/www/dato
REF=origin/main
BACKUP="/root/backups/frontend-performance-$(date +%Y%m%d-%H%M%S)"
FILES=("resources/js/app.jsx" "resources/js/Pages/LegalDocument.jsx" "scripts/audit_frontend_chunks.cjs" "scripts/install_frontend_performance.sh")
mkdir -p "$BACKUP/original" "$BACKUP/staged"
echo "Backup: $BACKUP"
for file in "${FILES[@]}"; do
  mkdir -p "$BACKUP/staged/$(dirname "$file")"
  git show "$REF:$file" > "$BACKUP/staged/$file"
  case "$file" in *.cjs) node --check "$BACKUP/staged/$file";; *.sh) bash -n "$BACKUP/staged/$file";; esac
  if [ -f "$file" ]; then
    mkdir -p "$BACKUP/original/$(dirname "$file")"
    cp -a "$file" "$BACKUP/original/$file"
  fi
done
[ ! -d public/build ] || cp -a public/build "$BACKUP/build"
[ ! -f resources/data/explore-copy-manifest.json ] || cp -a resources/data/explore-copy-manifest.json "$BACKUP/explore-copy-manifest.json"
rollback() {
  code=$?
  trap - ERR
  echo "Build or verification failed ($code); reverting" >&2
  for file in "${FILES[@]}"; do
    if [ -f "$BACKUP/original/$file" ]; then cp -a "$BACKUP/original/$file" "$file"; else rm -f "$file"; fi
  done
  if [ -d "$BACKUP/build" ]; then rm -rf public/build; cp -a "$BACKUP/build" public/build; fi
  [ ! -f "$BACKUP/explore-copy-manifest.json" ] || cp -a "$BACKUP/explore-copy-manifest.json" resources/data/explore-copy-manifest.json
  php artisan optimize:clear || true
  echo "Restored: $BACKUP" >&2
  exit "$code"
}
trap rollback ERR
for file in "${FILES[@]}"; do mkdir -p "$(dirname "$file")"; cp -a "$BACKUP/staged/$file" "$file"; done
echo "Building split pages..."
NODE_OPTIONS="--max-old-space-size=768" npm run build
test -s public/build/manifest.json
node scripts/audit_frontend_chunks.cjs "$BACKUP/frontend-audit.json"
php artisan route:list --json > "$BACKUP/routes.json"
python3 - "$BACKUP/routes.json" <<'PY'
import json,sys
routes=json.load(open(sys.argv[1],encoding='utf8'))
uris={str(r.get('uri','')).strip('/') for r in routes}
expected={'numbers','explore/emotions','explore/dreams','explore/archetypes','explore/patterns','explore/mirror','explore','live'}
expected|={'explore/'+x for x in ('relationships','body','choice','beliefs','values','fears','time','conflicts','attention')}
missing=sorted(expected-uris)
if missing:sys.exit('Missing routes: '+', '.join(missing))
if not any(u=='gods' or u.startswith('gods/') for u in uris):sys.exit('Missing Filament admin route')
if not any('legal' in u or u in ('terms','privacy') for u in uris):sys.exit('Missing legal route')
print('PASS: all 15 discovery directions, /live, Filament admin, legal routes')
PY
php artisan optimize:clear
trap - ERR
echo "COMPLETED; performance report: $BACKUP/frontend-audit.json"
echo "BACKUP: $BACKUP"
echo "Browser interactions should be checked separately on desktop/mobile."
