#!/usr/bin/env bash
# One-shot test system setup — run this ON THE PROXMOX HOST. It creates
# the LXC, installs Docker, clones the given branch inside it, asks for
# the handful of secrets no script can know, and brings the stack up.
# See infrastructure/TEST_DEPLOYMENT.md for the full picture and what
# stays manual afterwards (Nginx Proxy Manager, GitHub Actions secrets).
#
# To run a second, independent test system for a different branch, copy
# this file, change VMID/HOSTNAME/GIT_BRANCH below, and run the copy.

set -euo pipefail

# ---- CONFIG — edit these ----------------------------------------------
VMID=900                        # pick a free VMID (pveam/pct list to check)
HOSTNAME="sck-test"
STORAGE="local-lvm"             # storage pool for the container's rootfs
BRIDGE="vmbr0"                  # network bridge
IP_CONFIG="dhcp"                 # or e.g. "192.168.1.50/24,gw=192.168.1.1"
CORES=2
MEMORY_MB=2048
DISK_GB=8
TEMPLATE_STORAGE="local"        # storage pool holding the CT template

GIT_REPO_URL="https://github.com/comcy/skiclub-kapfenburg.de.git"
GIT_BRANCH="release/2026-08-20" # branch this test system tracks
APP_DIR="/opt/sck-test"          # checkout path inside the LXC
# -------------------------------------------------------------------------

TEMPLATE="debian-12-standard_12.7-1_amd64.tar.zst"

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

echo "▶ Cloning ${GIT_REPO_URL} (${GIT_BRANCH}) into ${APP_DIR}..."
pct exec "$VMID" -- bash -c "
  mkdir -p '${APP_DIR}' &&
  git clone --branch '${GIT_BRANCH}' --single-branch '${GIT_REPO_URL}' '${APP_DIR}'
"

# ---- .env: ask for the values only you know ----------------------------
echo
echo "▶ Now the values in .env that this script can't know."
echo "  Leave any of these blank to skip and fill in by hand later"
echo "  (edit ${APP_DIR}/.env inside the LXC, then re-run the compose"
echo "  commands printed at the end)."
echo

read -rp "SMTP server (e.g. smtp.example.com): " SMTP_SERVER
read -rp "SMTP port [465]: " SMTP_PORT
SMTP_PORT="${SMTP_PORT:-465}"
read -rp "Sender email address: " SENDER_MAIL
read -rsp "Sender email password: " SENDER_PW
echo
read -rp "Course sheet URL: " COURSE_SHEET_URL
read -rp "Trip sheet URL: " TRIP_SHEET_URL
read -rp "Public URL this test system's web build should call for the API (e.g. https://sck-api-test.example.com/api): " SCK_API_URL

read -rp "Auto-generate SEPA_ENCRYPTION_KEY (needed for the online membership form)? [Y/n]: " GEN_SEPA
if [[ "${GEN_SEPA:-y}" =~ ^[Yy]?$ ]]; then
  SEPA_ENCRYPTION_KEY="$(openssl rand -hex 32)"
else
  read -rp "SEPA_ENCRYPTION_KEY (64-char hex, blank to fill in later): " SEPA_ENCRYPTION_KEY
fi

echo "▶ Writing ${APP_DIR}/.env..."
cat <<EOF | pct exec "$VMID" -- tee "${APP_DIR}/.env" > /dev/null
SMTP_SERVER=${SMTP_SERVER}
SMTP_PORT=${SMTP_PORT}
SENDER_MAIL=${SENDER_MAIL}
SENDER_PW=${SENDER_PW}
SEPA_ENCRYPTION_KEY=${SEPA_ENCRYPTION_KEY}
SCK_API_URL=${SCK_API_URL}
COURSE_SHEET_URL=${COURSE_SHEET_URL}
TRIP_SHEET_URL=${TRIP_SHEET_URL}
EOF

echo "▶ Building images and starting the stack (this takes a few minutes)..."
pct exec "$VMID" -- bash -c "cd '${APP_DIR}' && docker compose build && docker compose up -d"

echo
echo "🎉 Done. LXC ${VMID} (${HOSTNAME}) is running web on :8080 and sck-api on :3000."
echo "   docker compose ps / logs:  pct exec ${VMID} -- bash -c 'cd ${APP_DIR} && docker compose ps'"
echo "   Still to do manually — see infrastructure/TEST_DEPLOYMENT.md:"
echo "   - Two Proxy Hosts in Nginx Proxy Manager (web → :8080, api → :3000)"
echo "   - If SCK_API_URL wasn't final above: fix .env, then"
echo "     'docker compose build web && docker compose up -d web'"
echo "   - GitHub Actions secrets, if you want future deploys via the"
echo "     'Test-System Deploy' workflow instead of re-running this script"
