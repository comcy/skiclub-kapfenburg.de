#!/usr/bin/env bash
# Boots the API + sck-admin-app dev servers (if not already running) and
# prints a ready-to-use admin login credential - collapses the "start
# servers, request a magic link, dig the token out of the log, exchange it
# for a session" dance into one command, so a full interactive visual check
# (see CLAUDE.md) is the default, not something worth skimping on because
# it takes several manual round-trips.
#
# A magic-link token is single-use: verifying it to hand back a Bearer
# session token necessarily burns it, so it can't also still work as a
# browser login URL afterwards. Pick ONE mode per call.
#
# Usage:
#   scripts/dev-login.sh              # prints a login URL (open in browser/Playwright)
#   scripts/dev-login.sh --session    # verifies immediately, prints a Bearer token (for curl/API seeding)
#   scripts/dev-login.sh someone@example.com [--session]
#   scripts/dev-login.sh --stop       # stop both dev servers

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

API_PORT=3000
ADMIN_PORT=4201
ADMIN_URL_BASE="http://localhost:$ADMIN_PORT"
API_LOG="${TMPDIR:-/tmp}/sck-api-dev.log"
ADMIN_LOG="${TMPDIR:-/tmp}/sck-admin-dev.log"

SESSION_MODE=false
EMAIL=""
for arg in "$@"; do
  case "$arg" in
    --stop)
      pkill -f "ts-node/esm.*--experimental-specifier-resolution=node src/index.ts" 2>/dev/null || true
      pkill -f "ng serve sck-admin-app" 2>/dev/null || true
      echo "Dev-Server gestoppt."
      exit 0
      ;;
    --session) SESSION_MODE=true ;;
    *) EMAIL="$arg" ;;
  esac
done

EMAIL="${EMAIL:-$(grep -oP '^SUPER_ADMIN_EMAIL=\K.*' src/api/sck-api/.env 2>/dev/null || true)}"
if [ -z "$EMAIL" ]; then
  echo "Keine E-Mail übergeben und kein SUPER_ADMIN_EMAIL in src/api/sck-api/.env gefunden." >&2
  echo "Usage: $0 [email] [--session] | --stop" >&2
  exit 1
fi

is_up() { curl -s -o /dev/null -m 2 "http://localhost:$1"; }

if ! is_up "$API_PORT"; then
  echo "▶ Starte API-Dev-Server (Port $API_PORT)..." >&2
  # Dummy dev key, nur nötig für Member-/IBAN-Endpunkte - echte Secrets
  # kommen ausschließlich aus der echten .env/dem Server-Environment.
  (cd src/api/sck-api && SEPA_ENCRYPTION_KEY="${SEPA_ENCRYPTION_KEY:-0000000000000000000000000000000000000000000000000000000000000000}" nohup npm run start:dev > "$API_LOG" 2>&1 &)
fi

if ! is_up "$ADMIN_PORT"; then
  echo "▶ Starte sck-admin-app-Dev-Server (Port $ADMIN_PORT)..." >&2
  (cd src/web && nohup npx ng serve sck-admin-app --port "$ADMIN_PORT" > "$ADMIN_LOG" 2>&1 &)
fi

echo "⏳ Warte auf beide Server..." >&2
for port in "$API_PORT" "$ADMIN_PORT"; do
  until is_up "$port"; do sleep 2; done
done

# publicWriteLimiter caps this at 20 req/15min (rate-limit.ts) - easy to
# hit during repeated manual testing. A non-200 here means no fresh token
# was actually created, so silently continuing would re-grab and fail on
# an already-used token from the log instead of explaining what happened.
HTTP_STATUS=$(curl -s -o /dev/null -w '%{http_code}' -X POST "http://localhost:$API_PORT/api/auth/magic-link" \
  -H "Content-Type: application/json" -d "{\"email\":\"$EMAIL\"}")
if [ "$HTTP_STATUS" != "200" ]; then
  echo "Magic-Link-Anfrage fehlgeschlagen (HTTP $HTTP_STATUS) - evtl. Rate-Limit (20/15min) erreicht." >&2
  echo "API-Dev-Server neu starten, um den In-Memory-Zähler zurückzusetzen: scripts/dev-login.sh --stop && scripts/dev-login.sh" >&2
  exit 1
fi
sleep 1.5

# Letztes (nicht erstes) Vorkommen - der Log wächst über mehrere Aufrufe
# hinweg, ein älterer Token wäre bereits verbraucht/abgelaufen. `head -1`
# ist nötig, weil die Mail-Log-Zeile den Token zweimal enthält (href +
# Linktext) - grep -m1 stoppt nach der ersten TREFFERZEILE, gibt darin
# aber trotzdem beide Vorkommen aus.
TOKEN=$(tac "$API_LOG" | grep -m1 -oP 'token=\K[a-f0-9]+' | head -1 || true)
if [ -z "$TOKEN" ]; then
  echo "Konnte keinen Magic-Link-Token aus $API_LOG lesen (E-Mail eingeladen/SUPER_ADMIN?)." >&2
  exit 1
fi

echo >&2

if [ "$SESSION_MODE" = true ]; then
  SESSION=$(curl -s -X POST "http://localhost:$API_PORT/api/auth/magic-link/verify" \
    -H "Content-Type: application/json" -d "{\"token\":\"$TOKEN\"}" \
    | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).sessionToken||'')}catch{console.log('')}})")
  if [ -z "$SESSION" ]; then
    echo "Verify fehlgeschlagen - Token ungültig/abgelaufen." >&2
    exit 1
  fi
  echo "✔ Bearer-Session-Token (für direkte curl-Aufrufe gegen die API, z.B.:" >&2
  echo "  curl -H \"Authorization: Bearer \$TOKEN\" http://localhost:$API_PORT/api/members):" >&2
  echo "$SESSION"
else
  echo "✔ Login-URL (einmalig gültig, im Browser/Playwright öffnen):" >&2
  echo "$ADMIN_URL_BASE/auth/callback?token=$TOKEN"
fi

echo >&2
echo "API-Log:   $API_LOG" >&2
echo "Admin-Log: $ADMIN_LOG" >&2
echo "Stoppen:   scripts/dev-login.sh --stop" >&2
