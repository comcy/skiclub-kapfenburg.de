# Test-System: Setup & Betrieb

Containerisiertes Test-Deployment von `web` + `sck-api` auf einer eigenen
Proxmox-LXC, getrennt von der bestehenden Produktivumgebung (die weiterhin
unverändert über `sck-web-app-build-deploy.yml` / `sck-api-deploy.yml`
läuft). Reverse Proxy + TLS übernimmt der bereits vorhandene Nginx Proxy
Manager (NPM) auf seiner eigenen LXC.

## Einmaliges Setup

### 1. LXC erstellen

Auf dem Proxmox-Host, nach Anpassung der `CONFIG`-Werte am Anfang des
Skripts (VMID, Storage-Pool, Bridge, IP) an eure Umgebung:

```bash
bash infrastructure/proxmox/create-test-lxc.sh
```

Legt eine unprivilegierte Debian-12-LXC an und installiert darin Docker
Engine + Compose-Plugin.

### 2. Repository auf der LXC klonen

```bash
pct exec <VMID> -- bash
mkdir -p /opt/sck-test && cd /opt/sck-test
git clone https://github.com/comcy/skiclub-kapfenburg.de.git .
```

(`/opt/sck-test` ist der `APP_DIR`, den auch der Deploy-Workflow
erwartet — siehe `.github/workflows/test-deploy.yml`.)

### 3. `.env` befüllen

```bash
cp .env.example .env
vi .env   # SMTP_*, SCK_API_URL (Test-Subdomain!), COURSE_SHEET_URL, TRIP_SHEET_URL
```

`.env` ist gitignored — bleibt nur auf dem Server, wird von keinem
Deploy überschrieben (der Workflow macht `git fetch` + `checkout`,
fasst `.env` nicht an).

### 4. Ersten Start prüfen

```bash
docker compose build
docker compose up -d
docker compose ps   # beide Services sollten "healthy" werden
```

### 5. Zwei Proxy Hosts in Nginx Proxy Manager anlegen

Im NPM-Web-UI, „Proxy Hosts" → „Add Proxy Host", je einmal für Web und
API:

| Feld | Web | API |
|---|---|---|
| Domain Names | `test.<eure-domain>` | `sck-api-test.<eure-domain>` |
| Scheme | http | http |
| Forward Hostname/IP | IP der `sck-test`-LXC | IP der `sck-test`-LXC |
| Forward Port | `8080` | `3000` |
| SSL | Let's Encrypt aktivieren, „Force SSL" | Let's Encrypt aktivieren, „Force SSL" |

Die `SCK_API_URL` in `.env` muss exakt auf die hier vergebene
API-Domain zeigen (inkl. `/api`-Pfad, siehe `.env.example`) — danach
einmal `docker compose build web && docker compose up -d web`, damit der
neue Build den korrekten Wert einbacket (der Wert wird zur Build-Zeit in
`environment.prod.ts` eingesetzt, nicht zur Laufzeit gelesen).

### 6. GitHub Secrets für den Deploy-Workflow

Repo-Settings → Secrets and variables → Actions:

- `TEST_SERVER_ADDRESS` — IP/Hostname der `sck-test`-LXC
- `TEST_SSH_USER`
- `TEST_SSH_PASSWORD`
- `TEST_SSH_PORT` (optional, Default 22)

## Alltag

**Neu deployen:** GitHub → Actions → „Test-System Deploy" → „Run
workflow", Branch eingeben (Default `master`).

**Logs ansehen:**
```bash
docker compose logs -f api
docker compose logs -f web
```

**Testdaten zurücksetzen** (löscht `registrations.ndjson` im
`sck-api-data`-Volume):
```bash
docker compose down -v
docker compose up -d
```

**Manuell neu bauen/starten** (ohne CI):
```bash
cd /opt/sck-test
git pull
docker compose build
docker compose up -d
```
