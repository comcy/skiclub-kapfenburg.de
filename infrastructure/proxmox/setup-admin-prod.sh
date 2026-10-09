#!/usr/bin/env bash
# Skiclub Kapfenburg — sck-admin-app production setup. Run this ON THE
# PROXMOX HOST, either as a local checkout or piped straight in:
#
#   bash -c "$(curl -fsSL https://raw.githubusercontent.com/comcy/skiclub-kapfenburg.de/master/infrastructure/proxmox/setup-admin-prod.sh)"
#
# Dedicated, trimmed sibling of setup-test-system.sh for exactly ONE
# purpose: host the sck-admin-app frontend as its own LXC, separate from
# the sck-test system (which is explicitly test infrastructure, see
# TEST_DEPLOYMENT.md) and separate from the skiclub-kapfenburg.de domain
# (the admin app lives on your own infra instead, see
# infrastructure/README.md "Warum ein eigenes LXC").
#
# Deliberately does NOT build/run sck-api or sck-app here, even though
# docker-compose.yml has services for both — the admin app talks to the
# REAL production sck-api (already deployed elsewhere, see
# ADMIN_PROD_DEPLOY.md), not a local one. Running an extra, unused local
# sck-api next to it would be both wasted RAM and a real footgun (two
# "production-shaped" APIs with diverging data if anyone ever points the
# wrong thing at the wrong one). Only `admin`'s build args are prompted
# for below.
#
# No pre-editing required, safe to re-run against the same VMID (reuses
# the LXC, keeps existing .env values).

set -euo pipefail

GIT_REPO_URL="https://github.com/comcy/skiclub-kapfenburg.de.git"
APP_DIR="/opt/sck-admin-prod" # checkout path inside the LXC

DEFAULT_VMID=901
DEFAULT_HOSTNAME="sck-admin-prod"
DEFAULT_STORAGE="local-lvm"
DEFAULT_BRIDGE="vmbr0"
DEFAULT_IP_CONFIG="dhcp"
DEFAULT_CORES=1
DEFAULT_MEMORY_MB=512 # one static nginx container - no Angular/Node build happens on this box, only in CI
DEFAULT_DISK_GB=4
DEFAULT_TEMPLATE_STORAGE="local"
DEFAULT_BRANCH="master"
TEMPLATE="debian-12-standard_12.7-1_amd64.tar.zst"

echo "Skiclub Kapfenburg — sck-admin-app Produktiv-Setup"
echo

read -rp "Default LXC-Settings verwenden (VMID ${DEFAULT_VMID}, ${DEFAULT_CORES} vCPU, ${DEFAULT_MEMORY_MB}MB RAM, ${DEFAULT_DISK_GB}GB Disk, DHCP)? [Y/n]: " USE_DEFAULTS
if [[ "${USE_DEFAULTS:-y}" =~ ^[Yy]?$ ]]; then
  VMID=$DEFAULT_VMID
  HOSTNAME=$DEFAULT_HOSTNAME
  STORAGE=$DEFAULT_STORAGE
  BRIDGE=$DEFAULT_BRIDGE
  IP_CONFIG=$DEFAULT_IP_CONFIG
  CORES=$DEFAULT_CORES
  MEMORY_MB=$DEFAULT_MEMORY_MB
  DISK_GB=$DEFAULT_DISK_GB
  TEMPLATE_STORAGE=$DEFAULT_TEMPLATE_STORAGE
else
  read -rp "VMID (bestehende id nutzt dieses LXC weiter) [${DEFAULT_VMID}]: " VMID
  VMID="${VMID:-$DEFAULT_VMID}"
  read -rp "Hostname [${DEFAULT_HOSTNAME}]: " HOSTNAME
  HOSTNAME="${HOSTNAME:-$DEFAULT_HOSTNAME}"
  read -rp "Storage-Pool fürs rootfs [${DEFAULT_STORAGE}]: " STORAGE
  STORAGE="${STORAGE:-$DEFAULT_STORAGE}"
  read -rp "Netzwerk-Bridge [${DEFAULT_BRIDGE}]: " BRIDGE
  BRIDGE="${BRIDGE:-$DEFAULT_BRIDGE}"
  read -rp "IP-Konfig, dhcp oder CIDR,gw=... [${DEFAULT_IP_CONFIG}]: " IP_CONFIG
  IP_CONFIG="${IP_CONFIG:-$DEFAULT_IP_CONFIG}"
  read -rp "CPU-Kerne [${DEFAULT_CORES}]: " CORES
  CORES="${CORES:-$DEFAULT_CORES}"
  read -rp "Memory in MB [${DEFAULT_MEMORY_MB}]: " MEMORY_MB
  MEMORY_MB="${MEMORY_MB:-$DEFAULT_MEMORY_MB}"
  read -rp "Disk-Größe in GB [${DEFAULT_DISK_GB}]: " DISK_GB
  DISK_GB="${DISK_GB:-$DEFAULT_DISK_GB}"
  read -rp "Template-Storage-Pool [${DEFAULT_TEMPLATE_STORAGE}]: " TEMPLATE_STORAGE
  TEMPLATE_STORAGE="${TEMPLATE_STORAGE:-$DEFAULT_TEMPLATE_STORAGE}"
fi

read -rp "Branch [${DEFAULT_BRANCH}]: " GIT_BRANCH
GIT_BRANCH="${GIT_BRANCH:-$DEFAULT_BRANCH}"

# ---- LXC: anlegen falls nötig, sonst nur sicherstellen dass es läuft ---
if pct status "$VMID" &>/dev/null; then
  echo "▶ LXC ${VMID} existiert bereits — wird weiterverwendet."
  if [[ "$(pct status "$VMID")" != "status: running" ]]; then
    pct start "$VMID"
    sleep 5
  fi
else
  echo "▶ Prüfe Template ${TEMPLATE} auf ${TEMPLATE_STORAGE}..."
  if ! pveam list "$TEMPLATE_STORAGE" | grep -q "$TEMPLATE"; then
    echo "  Nicht lokal vorhanden, lade herunter..."
    pveam update
    pveam download "$TEMPLATE_STORAGE" "$TEMPLATE"
  fi

  echo "▶ Erstelle LXC ${VMID} (${HOSTNAME})..."
  pct create "$VMID" "${TEMPLATE_STORAGE}:vztmpl/${TEMPLATE}" \
    --hostname "$HOSTNAME" \
    --cores "$CORES" \
    --memory "$MEMORY_MB" \
    --rootfs "${STORAGE}:${DISK_GB}" \
    --net0 "name=eth0,bridge=${BRIDGE},ip=${IP_CONFIG}" \
    --unprivileged 1 \
    --features nesting=1,keyctl=1 \
    --onboot 1

  echo "▶ Starte LXC..."
  pct start "$VMID"
  sleep 5

  echo "▶ Installiere git, Docker Engine + Compose-Plugin im LXC..."
  pct exec "$VMID" -- bash -c "
    apt-get update &&
    apt-get install -y ca-certificates curl git &&
    install -m 0755 -d /etc/apt/keyrings &&
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc &&
    chmod a+r /etc/apt/keyrings/docker.asc &&
    echo \"deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \$(. /etc/os-release && echo \$VERSION_CODENAME) stable\" \
      > /etc/apt/sources.list.d/docker.list &&
    apt-get update &&
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin &&
    systemctl enable --now docker
  "
fi

# ---- Repo: klonen falls nötig, sonst fetch + Branch wechseln -----------
if pct exec "$VMID" -- test -d "${APP_DIR}/.git" &>/dev/null; then
  echo "▶ Repo bereits ausgecheckt — wechsle zu ${GIT_BRANCH}..."
  pct exec "$VMID" -- bash -c "
    cd '${APP_DIR}' &&
    git fetch origin '${GIT_BRANCH}:refs/remotes/origin/${GIT_BRANCH}' &&
    git checkout -B '${GIT_BRANCH}' 'origin/${GIT_BRANCH}'
  "
else
  echo "▶ Klone ${GIT_REPO_URL} (${GIT_BRANCH}) nach ${APP_DIR}..."
  pct exec "$VMID" -- bash -c "
    mkdir -p '${APP_DIR}' &&
    git clone --branch '${GIT_BRANCH}' --single-branch '${GIT_REPO_URL}' '${APP_DIR}'
  "
fi

# ---- .env: nur die drei Felder, die der admin-Service tatsächlich -----
# braucht (siehe docker-compose.yml "admin" + Dockerfile build args).
declare -A ENV_VALUES
if pct exec "$VMID" -- test -f "${APP_DIR}/.env" &>/dev/null; then
  EXISTING_ENV="$(pct exec "$VMID" -- cat "${APP_DIR}/.env")"
  while IFS='=' read -r key value; do
    [[ -z "$key" || "$key" == \#* ]] && continue
    ENV_VALUES["$key"]="$value"
  done <<< "$EXISTING_ENV"
fi

echo
echo "▶ .env — bereits gesetzte Werte bleiben erhalten, nur fehlende werden"
echo "  abgefragt."
echo

prompt_if_missing() {
  local key="$1" label="$2" value
  if [[ -n "${ENV_VALUES[$key]:-}" ]]; then
    echo "  ${key}: bereits gesetzt, bleibt."
    return
  fi
  read -rp "  ${label}: " value
  ENV_VALUES["$key"]="$value"
}

if [[ -z "${ENV_VALUES[SCK_API_URL]:-}" ]]; then
  echo "  Die ECHTE Produktiv-API, nicht die Test-API — die Admin-App auf"
  echo "  diesem LXC bedient dieselben Live-Daten wie skiclub-kapfenburg.de."
fi
prompt_if_missing SCK_API_URL "Produktiv-API-URL (z.B. https://sck-api.example.com/api)"
prompt_if_missing TURNSTILE_SITE_KEY "Turnstile Site Key (öffentlich, leer lassen = Captcha-Widget inaktiv)"
if [[ -z "${ENV_VALUES[ADMIN_APP_URL]:-}" ]]; then
  echo "  Wird in Magic-Link-Mails eingebettet — die Domain, unter der die"
  echo "  Admin-App am Ende erreichbar ist, z.B. https://admin.5i1f4ng.de"
  echo "  (sobald der NPM-Proxy-Host dafür steht; bis dahin http://<LXC-IP>:8081)."
fi
prompt_if_missing ADMIN_APP_URL "Admin-App-URL"

echo "▶ Schreibe ${APP_DIR}/.env..."
{
  for key in SCK_API_URL TURNSTILE_SITE_KEY ADMIN_APP_URL; do
    echo "${key}=${ENV_VALUES[$key]:-}"
  done
} | pct exec "$VMID" -- tee "${APP_DIR}/.env" > /dev/null

echo "▶ Baue und starte NUR den admin-Service (bewusst kein api/web hier)..."
pct exec "$VMID" -- bash -c "cd '${APP_DIR}' && docker compose build admin && docker compose up -d admin"

echo
echo "🎉 Fertig. LXC ${VMID} (${HOSTNAME}) läuft, Admin-App auf Port :8081, Branch ${GIT_BRANCH}."
echo "   Status/Logs:  pct exec ${VMID} -- bash -c 'cd ${APP_DIR} && docker compose ps'"
echo "   Noch manuell zu erledigen — siehe infrastructure/README.md:"
echo "   - Proxy Host in Nginx Proxy Manager (admin → :8081, TLS)"
echo "   - Falls ADMIN_APP_URL oben nur die LXC-IP war: .env nachtragen, dann"
echo "     'docker compose build admin && docker compose up -d admin'"
echo "   - Self-hosted GitHub-Actions-Runner auf diesem LXC registrieren"
echo "     (Label: sck-admin-prod), für automatische Redeploys bei Push"
