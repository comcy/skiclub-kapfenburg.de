# sck-admin-app produktiv deployen: einmalige Checkliste

`sck-admin-app` läuft produktiv **nicht** auf dem Alfahosting-Server von
`skiclub-kapfenburg.de` (wo sck-app/sck-api liegen), sondern auf eigener
Infrastruktur (5i1f4ng.de) als eigenes LXC — eine bewusste Entscheidung
vom 2026-10-09, siehe [`README.md`](./README.md) Abschnitt "Warum ein
eigenes LXC für die Admin-App". Mechanismus wie beim Test-System (Docker +
self-hosted GitHub-Actions-Runner, siehe
[`TEST_DEPLOYMENT.md`](./TEST_DEPLOYMENT.md)), nicht wie
`sck-web-app-build-deploy.yml` (kein SCP, kein Apache für diese App).

Die Admin-App spricht dabei weiterhin mit der **echten** Produktiv-sck-api
(Alfahosting) — nur das Frontend zieht um, kein zweites Backend, keine
zweite Datenbank.

## 1. LXC einrichten

Auf dem Proxmox-Host (deinem 5i1f4ng.de-Server), ein Einzeiler, nichts
vorher zu klonen/editieren:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/comcy/skiclub-kapfenburg.de/master/infrastructure/proxmox/setup-admin-prod.sh)"
```

Fragt interaktiv VMID/Hostname/Ressourcen (Defaults: VMID 901, 1 vCPU,
512 MB RAM, 4 GB Disk — ein einzelner statischer nginx-Container braucht
wenig) sowie drei `.env`-Werte ab:

- **`SCK_API_URL`** — die echte Produktiv-API-URL (dieselbe, die auch
  `sck-app` benutzt), **nicht** die Test-API.
- **`TURNSTILE_SITE_KEY`** — öffentlicher Cloudflare-Turnstile-Key (leer
  lassen = Captcha-Widget bleibt inaktiv, siehe `README.md`).
- **`ADMIN_APP_URL`** — wo die Admin-App am Ende erreichbar ist, z.B.
  `https://admin.5i1f4ng.de` (oder vorerst `http://<LXC-IP>:8081`, bis
  Schritt 2 steht — dann hier nachtragen und
  `docker compose build admin && docker compose up -d admin` erneut
  laufen lassen).

Baut und startet danach **nur** den `admin`-Service aus dem bestehenden
`docker-compose.yml` — bewusst kein lokales `api`/`web` auf diesem LXC
(würde nur RAM verschwenden und eine zweite, unbenutzte "Produktiv"-API
mit eigener leerer SQLite-DB danebenstellen, siehe Kommentar im Skript).

## 2. Proxy Host + TLS in Nginx Proxy Manager

Wie beim Test-System (`TEST_DEPLOYMENT.md` Schritt 2), ein neuer Proxy
Host:

| Feld | Wert |
|---|---|
| Domain Names | `admin.5i1f4ng.de` (oder deine Wahl) |
| Scheme | http |
| Forward Hostname/IP | IP des `sck-admin-prod`-LXC |
| Forward Port | `8081` |
| SSL | Let's Encrypt, „Force SSL" |

Falls `ADMIN_APP_URL` beim Skriptlauf noch nicht feststand: `.env` auf
dem LXC nachtragen (siehe Schritt 1), dann `docker compose build admin &&
docker compose up -d admin`.

## 3. Self-hosted GitHub-Actions-Runner auf dem LXC

Für automatische Redeploys bei Push auf `master`, statt das Setup-Skript
jedes Mal erneut laufen zu lassen. Gleiches Muster wie beim Test-System
(`TEST_DEPLOYMENT.md` Schritt 3), eigenes Label:

Repo → Settings → Actions → Runners → „New self-hosted runner", Linux/x64,
das angezeigte Download/Configure-Snippet auf dem LXC ausführen. Beim
Konfigurieren als **Label `sck-admin-prod`** vergeben (exakt das erwartet
`.github/workflows/sck-admin-app-build-deploy.yml`:
`runs-on: [self-hosted, sck-admin-prod]`) — als systemd-Service unter
einem eigenen, nicht-root `github-runner`-User installieren
(`svc.sh install && svc.sh start`).

Einmalig danach: `chown -R github-runner:github-runner /opt/sck-admin-prod`
auf dem LXC, damit der Runner-User das Repo-Checkout selbst aktualisieren
kann.

## 4. GitHub Secrets prüfen

Kein neues Secret für diesen Workflow selbst nötig (`SCK_API_URL`/
`TURNSTILE_SITE_KEY`/`ADMIN_APP_URL` leben in der `.env` auf dem LXC, nicht
in GitHub Secrets — anders als der alte SCP-Mechanismus). Trotzdem
relevant für den Rest der Prod-Config (sck-api selbst liest
`ADMIN_APP_URL` auch, für die Magic-Link-Mails — siehe
[`README.md`](./README.md)):

```bash
gh secret set ADMIN_APP_URL --body "https://admin.5i1f4ng.de"
```

`SERVER_DIST_PATH_ADMIN` (altes SCP-Zielpfad-Secret) wird von keinem
Workflow mehr referenziert — kann gelöscht werden, falls es schon
angelegt war.

## 5. sck-api neu deployen, damit `ADMIN_APP_URL` dort ankommt

`ADMIN_APP_URL` wird auch von `sck-api` gelesen (Basis-URL für die
Magic-Link-/Invite-Login-Mails). Sobald das Secret in Schritt 4 gesetzt
ist, greift es beim nächsten erfolgreichen `SCK-API Deploy`-Lauf — dessen
eigener offener Punkt (noch nie erfolgreich gelaufen) steht in
[`README.md`](./README.md) Abschnitt "Bekanntes Problem".

## 6. Einmal testen

Nach einem Push auf `master`, der `SCK-ADMIN Workflow` auslöst (oder
manuell über Actions → „SCK-ADMIN Workflow" → „Run workflow"): Subdomain
im Browser öffnen, Login per echtem Magic-Link durchklicken, prüfen dass
der Link in der Mail auf `admin.5i1f4ng.de` zeigt (nicht `localhost:4200`
oder die alte Alfahosting-Vermutung).

## Danach

Jeder Push auf `master`, der `sck-admin-app`/die geteilten Angular-
Libraries betrifft, deployt automatisch auf das `sck-admin-prod`-LXC.
