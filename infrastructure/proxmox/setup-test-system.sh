#!/usr/bin/env bash
# Skiclub Kapfenburg — test system setup. Run this ON THE PROXMOX HOST,
# either as a local checkout or piped straight in like the Proxmox VE
# Helper-Scripts:
#
#   bash -c "$(curl -fsSL https://raw.githubusercontent.com/comcy/skiclub-kapfenburg.de/master/infrastructure/proxmox/setup-test-system.sh)"
#
# (bash -c "$(...)" downloads the script into a variable first, so your
# terminal's stdin is still free for the prompts below — unlike a plain
# `curl | bash` pipe, which would eat stdin and break `read`.)
#
# No pre-editing required: every setting below is an interactive prompt
# with a sensible default. Safe to run again and again against the same
# VMID — it reuses an existing LXC instead of recreating it (so the
# sck-api-data Docker volume, and whatever test data is in it, is never
# touched by this script), only prompts for .env values that aren't
# already set (existing ones are kept as-is), and asks which branch to
# deploy every time instead of hardcoding it.
#
# See infrastructure/TEST_DEPLOYMENT.md for the full picture and what
# stays manual afterwards (Nginx Proxy Manager, GitHub Actions secrets).

set -euo pipefail

GIT_REPO_URL="https://github.com/comcy/skiclub-kapfenburg.de.git"
APP_DIR="/opt/sck-test" # checkout path inside the LXC

DEFAULT_VMID=900
DEFAULT_HOSTNAME="sck-test"
DEFAULT_STORAGE="local-lvm"     # storage pool for the container's rootfs
DEFAULT_BRIDGE="vmbr0"          # network bridge
DEFAULT_IP_CONFIG="dhcp"        # or e.g. "192.168.1.50/24,gw=192.168.1.1"
DEFAULT_CORES=2
DEFAULT_MEMORY_MB=2048
DEFAULT_DISK_GB=8
DEFAULT_TEMPLATE_STORAGE="local" # storage pool holding the CT template
DEFAULT_BRANCH="master"
TEMPLATE="debian-12-standard_12.7-1_amd64.tar.zst"

echo "Skiclub Kapfenburg — Test-System Setup"
echo

read -rp "Use default LXC settings (VMID ${DEFAULT_VMID}, ${DEFAULT_CORES} vCPU, ${DEFAULT_MEMORY_MB}MB RAM, ${DEFAULT_DISK_GB}GB disk, DHCP)? [Y/n]: " USE_DEFAULTS
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
  read -rp "VMID (existing id reuses that LXC) [${DEFAULT_VMID}]: " VMID
  VMID="${VMID:-$DEFAULT_VMID}"
  read -rp "Hostname [${DEFAULT_HOSTNAME}]: " HOSTNAME
  HOSTNAME="${HOSTNAME:-$DEFAULT_HOSTNAME}"
  read -rp "Storage pool for rootfs [${DEFAULT_STORAGE}]: " STORAGE
  STORAGE="${STORAGE:-$DEFAULT_STORAGE}"
  read -rp "Network bridge [${DEFAULT_BRIDGE}]: " BRIDGE
  BRIDGE="${BRIDGE:-$DEFAULT_BRIDGE}"
  read -rp "IP config, dhcp or CIDR,gw=... [${DEFAULT_IP_CONFIG}]: " IP_CONFIG
  IP_CONFIG="${IP_CONFIG:-$DEFAULT_IP_CONFIG}"
  read -rp "CPU cores [${DEFAULT_CORES}]: " CORES
  CORES="${CORES:-$DEFAULT_CORES}"
  read -rp "Memory in MB [${DEFAULT_MEMORY_MB}]: " MEMORY_MB
  MEMORY_MB="${MEMORY_MB:-$DEFAULT_MEMORY_MB}"
  read -rp "Disk size in GB [${DEFAULT_DISK_GB}]: " DISK_GB
  DISK_GB="${DISK_GB:-$DEFAULT_DISK_GB}"
  read -rp "Template storage pool [${DEFAULT_TEMPLATE_STORAGE}]: " TEMPLATE_STORAGE
  TEMPLATE_STORAGE="${TEMPLATE_STORAGE:-$DEFAULT_TEMPLATE_STORAGE}"
fi

read -rp "Branch to deploy [${DEFAULT_BRANCH}]: " GIT_BRANCH
GIT_BRANCH="${GIT_BRANCH:-$DEFAULT_BRANCH}"

# ---- LXC: create if missing, otherwise just make sure it's running -----
if pct status "$VMID" &>/dev/null; then
  echo "▶ LXC ${VMID} already exists — reusing it, existing data stays untouched."
  if [[ "$(pct status "$VMID")" != "status: running" ]]; then
    pct start "$VMID"
    sleep 5
  fi
else
  echo "▶ Checking for template ${TEMPLATE} on ${TEMPLATE_STORAGE}..."
  if ! pveam list "$TEMPLATE_STORAGE" | grep -q "$TEMPLATE"; then
    echo "  Not found locally, downloading..."
    pveam update
    pveam download "$TEMPLATE_STORAGE" "$TEMPLATE"
  fi

  echo "▶ Creating LXC ${VMID} (${HOSTNAME})..."
  pct create "$VMID" "${TEMPLATE_STORAGE}:vztmpl/${TEMPLATE}" \
    --hostname "$HOSTNAME" \
    --cores "$CORES" \
    --memory "$MEMORY_MB" \
    --rootfs "${STORAGE}:${DISK_GB}" \
    --net0 "name=eth0,bridge=${BRIDGE},ip=${IP_CONFIG}" \
    --unprivileged 1 \
    --features nesting=1,keyctl=1 \
    --onboot 1

  echo "▶ Starting LXC..."
  pct start "$VMID"
  sleep 5

  echo "▶ Installing git, Docker Engine + Compose plugin inside the LXC..."
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

# ---- Repo: clone if missing, otherwise fetch + switch branch -----------
if pct exec "$VMID" -- test -d "${APP_DIR}/.git" &>/dev/null; then
  echo "▶ Repo already checked out — switching to ${GIT_BRANCH}..."
  pct exec "$VMID" -- bash -c "
    cd '${APP_DIR}' &&
    git fetch origin '${GIT_BRANCH}:refs/remotes/origin/${GIT_BRANCH}' &&
    git checkout -B '${GIT_BRANCH}' 'origin/${GIT_BRANCH}'
  "
else
  echo "▶ Cloning ${GIT_REPO_URL} (${GIT_BRANCH}) into ${APP_DIR}..."
  pct exec "$VMID" -- bash -c "
    mkdir -p '${APP_DIR}' &&
    git clone --branch '${GIT_BRANCH}' --single-branch '${GIT_REPO_URL}' '${APP_DIR}'
  "
fi

# ---- .env: keep whatever is already set, only ask for what's missing ---
declare -A ENV_VALUES
if pct exec "$VMID" -- test -f "${APP_DIR}/.env" &>/dev/null; then
  EXISTING_ENV="$(pct exec "$VMID" -- cat "${APP_DIR}/.env")"
  while IFS='=' read -r key value; do
    [[ -z "$key" || "$key" == \#* ]] && continue
    ENV_VALUES["$key"]="$value"
  done <<< "$EXISTING_ENV"
fi

echo
echo "▶ .env values — anything already set on the LXC is kept as-is and"
echo "  skipped below; only missing ones are asked for."
echo

prompt_if_missing() {
  local key="$1" label="$2" secret="${3:-}" value
  if [[ -n "${ENV_VALUES[$key]:-}" ]]; then
    echo "  ${key}: already set, keeping."
    return
  fi
  if [[ "$secret" == "secret" ]]; then
    read -rsp "  ${label}: " value
    echo
  else
    read -rp "  ${label}: " value
  fi
  ENV_VALUES["$key"]="$value"
}

prompt_if_missing SMTP_SERVER "SMTP server (e.g. smtp.example.com)"
prompt_if_missing SMTP_PORT "SMTP port [465]"
ENV_VALUES[SMTP_PORT]="${ENV_VALUES[SMTP_PORT]:-465}"
prompt_if_missing SENDER_MAIL "Sender email address"
prompt_if_missing SENDER_PW "Sender email password" secret
prompt_if_missing COURSE_SHEET_URL "Course sheet URL"
prompt_if_missing TRIP_SHEET_URL "Trip sheet URL"
if [[ -z "${ENV_VALUES[SCK_API_URL]:-}" ]]; then
  echo "  This gets baked into the web app's JS at build time and is then"
  echo "  called from each visitor's browser, which has no route into this"
  echo "  Docker network — so it must be a real public URL, not an"
  echo "  internal docker-compose service name like http://api:3000."
fi
prompt_if_missing SCK_API_URL "Public API URL (e.g. https://sck-api-test.example.com/api)"

if [[ -n "${ENV_VALUES[SEPA_ENCRYPTION_KEY]:-}" ]]; then
  echo "  SEPA_ENCRYPTION_KEY: already set, keeping."
else
  read -rp "  Auto-generate SEPA_ENCRYPTION_KEY (needed for the online membership form)? [Y/n]: " GEN_SEPA
  if [[ "${GEN_SEPA:-y}" =~ ^[Yy]?$ ]]; then
    ENV_VALUES[SEPA_ENCRYPTION_KEY]="$(openssl rand -hex 32)"
  else
    read -rp "  SEPA_ENCRYPTION_KEY (64-char hex, blank to fill in later): " ENV_VALUES[SEPA_ENCRYPTION_KEY]
  fi
fi

prompt_if_missing SUPER_ADMIN_EMAIL "Your email (gets full admin-app access on first login)"
if [[ -z "${ENV_VALUES[ADMIN_APP_URL]:-}" ]]; then
  echo "  Embedded in the magic-link login mail — must be wherever the admin"
  echo "  app is actually reachable from your browser, e.g. http://<LXC-IP>:8081"
  echo "  (or a real domain, once you have a Proxy Host for it)."
fi
prompt_if_missing ADMIN_APP_URL "Admin app URL (e.g. http://<LXC-IP>:8081)"

echo "▶ Writing ${APP_DIR}/.env..."
{
  for key in SMTP_SERVER SMTP_PORT SENDER_MAIL SENDER_PW SEPA_ENCRYPTION_KEY SUPER_ADMIN_EMAIL ADMIN_APP_URL SCK_API_URL COURSE_SHEET_URL TRIP_SHEET_URL; do
    echo "${key}=${ENV_VALUES[$key]:-}"
  done
} | pct exec "$VMID" -- tee "${APP_DIR}/.env" > /dev/null

echo "▶ Building images and starting the stack (this takes a few minutes)..."
echo "  (existing sck-api-data volume, if any, is left as-is — no 'down -v' here)"
# One at a time, not a plain "docker compose build" (parallel by default) -
# three Angular/Node builds fighting over the same RAM at once is how we
# found the OOM-kill issue documented in TEST_DEPLOYMENT.md.
pct exec "$VMID" -- bash -c "cd '${APP_DIR}' && docker compose build api && docker compose build web && docker compose build admin && docker compose up -d"

echo
echo "🎉 Done. LXC ${VMID} (${HOSTNAME}) is running web on :8080, sck-api on :3000, and the admin app on :8081, branch ${GIT_BRANCH}."
echo "   docker compose ps / logs:  pct exec ${VMID} -- bash -c 'cd ${APP_DIR} && docker compose ps'"
echo "   Still to do manually on first run — see infrastructure/TEST_DEPLOYMENT.md:"
echo "   - Proxy Hosts in Nginx Proxy Manager (web → :8080, api → :3000, optionally admin → :8081)"
echo "   - If SCK_API_URL wasn't final above: fix .env, then"
echo "     'docker compose build web && docker compose build admin && docker compose up -d web admin'"
echo "   - GitHub Actions secrets, if you want future deploys via the"
echo "     'Test-System Deploy' workflow instead of re-running this script"
