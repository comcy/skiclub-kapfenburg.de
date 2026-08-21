# Test-System: Setup & Betrieb

Containerisiertes Test-Deployment von `web` + `sck-api` auf einer eigenen
Proxmox-LXC, getrennt von der bestehenden Produktivumgebung (die weiterhin
unverändert über `sck-web-app-build-deploy.yml` / `sck-api-deploy.yml`
läuft). Reverse Proxy + TLS übernimmt der bereits vorhandene Nginx Proxy
Manager (NPM) auf seiner eigenen LXC.

## Einmaliges Setup

### 1. Alles auf einmal: LXC + Docker + Repo + `.env` + erster Start

Ein Skript, auf dem Proxmox-Host ausgeführt, erledigt die komplette
Kette von der leeren LXC bis zum laufenden Stack:

```bash
bash infrastructure/proxmox/setup-test-system.sh
```

Vorher den `CONFIG`-Block am Anfang des Skripts an eure Umgebung
anpassen (VMID, Storage-Pool, Bridge, IP, und `GIT_BRANCH` — welcher
Branch dieses Testsystem abbildet). Das Skript:

1. legt eine unprivilegierte Debian-12-LXC an,
2. installiert darin Docker Engine + Compose-Plugin,
3. klont den konfigurierten Branch nach `/opt/sck-test` in der LXC,
4. fragt interaktiv genau die Werte ab, die es nicht wissen kann (SMTP,
   Sheet-URLs, die öffentliche API-URL, SEPA-Schlüssel — Letzterer
   auf Wunsch automatisch generiert), schreibt daraus `.env`,
5. baut beide Images und startet den Stack (`docker compose up -d`).

Danach bleiben nur zwei Dinge manuell übrig (siehe Schritt 2 + 3
unten): die Proxy Hosts in NPM und optional die GitHub-Secrets für
spätere Redeploys per Workflow.

**Zweites Testsystem für einen anderen Branch?** Skript kopieren,
`VMID`/`HOSTNAME`/`GIT_BRANCH` in der Kopie anpassen, erneut ausführen
— siehe Kommentar am Kopf des Skripts.

### 2. Zwei Proxy Hosts in Nginx Proxy Manager anlegen

Im NPM-Web-UI, „Proxy Hosts" → „Add Proxy Host", je einmal für Web und
API:

| Feld | Web | API |
|---|---|---|
| Domain Names | `test.<eure-domain>` | `sck-api-test.<eure-domain>` |
| Scheme | http | http |
| Forward Hostname/IP | IP der `sck-test`-LXC | IP der `sck-test`-LXC |
| Forward Port | `8080` | `3000` |
| SSL | Let's Encrypt aktivieren, „Force SSL" | Let's Encrypt aktivieren, „Force SSL" |

Falls die API-Domain beim Skriptlauf noch nicht feststand: `.env` auf
der LXC nachtragen, dann `docker compose build web && docker compose
up -d web` — siehe „Konfiguration ändern" unten, warum das für `web`
einen Rebuild statt nur einen Neustart braucht.

### 3. GitHub Secrets für den Deploy-Workflow (optional)

Nur nötig, wenn ihr künftige Redeploys über die Actions-UI statt durch
erneutes Ausführen des Setup-Skripts anstoßen wollt. Repo-Settings →
Secrets and variables → Actions:

- `TEST_SERVER_ADDRESS` — IP/Hostname der `sck-test`-LXC
- `TEST_SSH_USER`
- `TEST_SSH_PASSWORD`
- `TEST_SSH_PORT` (optional, Default 22)

## Konfiguration ändern (SMTP, Sheet-URLs, API-URL, ...)

Alle Werte leben in **einer** Datei: `.env` in `/opt/sck-test` auf der
LXC (gitignored, wird von keinem `git pull`/Deploy angefasst). Wie eine
Änderung wirksam wird, hängt davon ab, **wann** der jeweilige Wert
gelesen wird:

- **Laufzeit-Variablen** (`sck-api` liest sie beim Start des Prozesses):
  `SMTP_SERVER`, `SMTP_PORT`, `SENDER_MAIL`, `SENDER_PW`,
  `SEPA_ENCRYPTION_KEY`. Ändern → `.env` bearbeiten, dann reicht ein
  Neustart des `api`-Containers, **kein** Rebuild:
  ```bash
  docker compose up -d api
  ```
- **Build-Zeit-Variablen** (werden beim `ng build` fest in die
  ausgelieferten JS-Dateien eingesetzt, siehe
  `src/web/scripts/envsubst.sh`): `SCK_API_URL`, `COURSE_SHEET_URL`,
  `TRIP_SHEET_URL`. Ändern → `.env` bearbeiten, dann **muss** `web` neu
  gebaut werden:
  ```bash
  docker compose build web && docker compose up -d web
  ```

Faustregel: `api` ändert sich sofort mit `up -d`, `web` braucht immer
`build` davor.

## Alltag

**Neu deployen** (nachdem GitHub Secrets eingerichtet sind — Schritt 3
oben): GitHub → Actions → „Test-System Deploy" → „Run workflow",
Branch eingeben (Default `master`).

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

**Manuell neu bauen/starten** (ohne CI, z. B. um einen anderen Branch
zu testen):
```bash
cd /opt/sck-test
git fetch && git checkout <branch>
docker compose build
docker compose up -d
```
