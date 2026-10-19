#!/usr/bin/env bash
# Restore Laravel file-session directory permissions for PHP-FPM.
# Run on the application server: sudo bash scripts/fix-session-permissions.sh
set -euo pipefail

cd "$(dirname "$0")/.."
session_dir="storage/framework/sessions"

if [[ ! -d "$session_dir" ]]; then
  echo "ERROR: $session_dir does not exist" >&2
  exit 1
fi

if [[ "$(id -u)" -ne 0 ]]; then
  echo "ERROR: Run this script with sudo/root privileges" >&2
  exit 1
fi

if ! id www-data >/dev/null 2>&1; then
  echo "ERROR: PHP-FPM user www-data does not exist" >&2
  exit 1
fi

# Change ownership only within the session directory, not the project or .env.
chown -R www-data:www-data "$session_dir"
find "$session_dir" -type d -exec chmod 770 {} +
find "$session_dir" -type f -exec chmod 660 {} +

# Remove an ACL mask that could prevent effective owner/group access.
# POSIX owner permissions already grant www-data full access after chown.
if command -v setfacl >/dev/null 2>&1; then
  setfacl -m u:www-data:rwx,m::rwx "$session_dir"
fi

if runuser -u www-data -- test -w "$session_dir"; then
  echo "OK: www-data can write to $session_dir"
else
  echo "ERROR: www-data still cannot write to $session_dir" >&2
  echo "Check parent directory permissions, filesystem mount, and security policy." >&2
  exit 1
fi
