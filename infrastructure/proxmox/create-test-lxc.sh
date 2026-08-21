#!/usr/bin/env bash
# Run this ON THE PROXMOX HOST (not in CI, not automated) to create the
# "sck-test" LXC and install Docker + the Compose plugin inside it.
# See infrastructure/TEST_DEPLOYMENT.md for the full one-time setup.
#
# Edit the CONFIG block below for your environment before running —
# these values (VMID, bridge, storage pool, IP) depend on your Proxmox
# setup and can't be guessed from the repo.

set -euo pipefail

# ---- CONFIG — edit these ----------------------------------------------
VMID=900                       # pick a free VMID (pveam/pct list to check)
HOSTNAME="sck-test"
STORAGE="local-lvm"            # storage pool for the container's rootfs
BRIDGE="vmbr0"                 # network bridge
IP_CONFIG="dhcp"                # or e.g. "192.168.1.50/24,gw=192.168.1.1"
CORES=2
MEMORY_MB=2048
DISK_GB=8
TEMPLATE_STORAGE="local"       # storage pool holding the CT template
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

echo "▶ Installing Docker Engine + Compose plugin inside the LXC..."
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

echo "▶ Done. LXC ${VMID} (${HOSTNAME}) is running with Docker installed."
echo "  Next: pct exec ${VMID} -- bash, then clone the repo and follow"
echo "  infrastructure/TEST_DEPLOYMENT.md to bring the stack up."
