#!/usr/bin/env bash
# Install systemd unit so the app survives reboots. Run ON THE VPS with sudo.
# 1. Clone/sync this repo to /opt/martin-os (or edit deploy/martin-os.service paths first).
# 2. cd /opt/martin-os && npm ci && npm run build
# 3. sudo bash scripts/vps-install-service.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
UNIT_SRC="$ROOT/deploy/martin-os.service"
UNIT_DST="/etc/systemd/system/martin-os.service"

if [[ "${EUID:-0}" -ne 0 ]]; then
  echo "Run with sudo: sudo bash scripts/vps-install-service.sh"
  exit 1
fi

sed -e "s|WorkingDirectory=/opt/martin-os|WorkingDirectory=$ROOT|g" \
  -e "s|EnvironmentFile=-/opt/martin-os/.env.production|EnvironmentFile=-$ROOT/.env.production|g" \
  "$UNIT_SRC" >"$UNIT_DST.tmp"
mv "$UNIT_DST.tmp" "$UNIT_DST"
systemctl daemon-reload
systemctl enable martin-os.service
echo "Installed $UNIT_DST (WorkingDirectory=$ROOT)"
echo "Start: sudo systemctl start martin-os"
echo "Logs: sudo journalctl -u martin-os -f"
