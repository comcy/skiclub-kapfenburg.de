# Deployment konfigurieren — Einstiegspunkt

Diese Datei beantwortet eine Frage: **was muss gesetzt sein, damit ein
Deploy dieses Systems funktioniert?** Für "was macht welcher Workflow"
siehe [CI_CD.md](./CI_CD.md), für die einmaligen Schritte beim
sck-admin-app-Produktiv-Deploy siehe [ADMIN_PROD_DEPLOY.md](./ADMIN_PROD_DEPLOY.md),
für das Docker-Testsystem siehe [TEST_DEPLOYMENT.md](./TEST_DEPLOYMENT.md).

Es gibt vier Deploy-Ziele, zwei verschiedene Mechanismen, **drei
verschiedene Server**:

| Ziel | Server | Mechanismus | Workflow |
|---|---|---|---|
| Test-System (Docker, eine LXC) | eigene Infra (5i1f4ng.de), LXC `sck-test` | Docker Compose, self-hosted Runner | `test-deploy.yml` |
| sck-app (Produktiv) | Alfahosting (skiclub-kapfenburg.de) | statisches Bundle per SCP auf Apache | `sck-web-app-build-deploy.yml` |
| sck-admin-app (Produktiv) | eigene Infra (5i1f4ng.de), eigenes LXC `sck-admin-prod` | Docker Compose, self-hosted Runner | `sck-admin-app-build-deploy.yml` |
| sck-api (Produktiv) | eigene Infra (5i1f4ng.de), eigenes LXC `sck-server` (CT 109) — **seit 2026-10-18, vorher Alfahosting per SSH** | Docker Compose, self-hosted Runner | `sck-api-prod-deploy.yml` |

**Architekturwechsel 2026-10-18:** sck-api lief vorher auf demselben
Alfahosting-Server wie sck-app, per SSH+systemd deployt
(`sck-api-build.yml`/`sck-api-deploy.yml`) — dieser Deploy ist seit
Workflow-Erstellung (Juni 2025) nie erfolgreich gelaufen (Details/Hypothese
dazu weiter unten unter "Gelöst durch Architekturwechsel"). Statt die
SSH-Pipeline zu reparieren: sck-api läuft jetzt wie sck-admin-app auf
eigener Infra per Docker + self-hosted Runner (Label `sck-server`, LXC
CT 109 auf 5i1f4ng.de, 2 vCPU/4096MB RAM/10GB Disk). `sck-app` bleibt
unverändert auf Alfahosting. Setup-Vorgehen + Reusable-Prozedur fürs
nächste Docker+Runner-Deploy-Ziel: siehe Vault, `Projects/sck-api
Produktiv-Deploy (CT109) — Setup.md`.

## Warum ein eigenes LXC für die Admin-App (seit 2026-10-09)

Bis 2026-10-09 war geplant, `sck-admin-app` wie `sck-app` per SCP auf den
Alfahosting-Server zu deployen (eigene Subdomain, gleicher Apache). Das
wurde verworfen: die Admin-App läuft stattdessen auf einem eigenen,
dedizierten LXC auf eigener Infra (`5i1f4ng.de`), analog zum bereits
bestehenden Test-System (Docker + self-hosted Runner statt SCP+Apache) —
siehe [`ADMIN_PROD_DEPLOY.md`](./ADMIN_PROD_DEPLOY.md) für die komplette
Einrichtung, [`infrastructure/proxmox/setup-admin-prod.sh`](./proxmox/setup-admin-prod.sh)
fürs LXC-Setup. Die Alfahosting/SCP-Variante bleibt als fertig
ausgearbeitete Alternative dokumentiert, falls ihr später zurückwechseln
wollt: [`ADMIN_PROD_DEPLOY_ALFAHOSTING_ALTERNATIVE.md`](./ADMIN_PROD_DEPLOY_ALFAHOSTING_ALTERNATIVE.md).

**Wichtig:** Das ist nur ein Umzug des **Frontends**. Die Admin-App spricht
weiterhin mit der echten Produktiv-sck-api auf dem Alfahosting-Server
(`SCK_API_URL` zeigt dorthin) — es gibt kein zweites Backend, keine zweite
Datenbank. Bewusst auch **nicht** die bestehende `sck-test`-LXC
mitbenutzt, obwohl die bereits einen `admin`-Container hat: die ist laut
`TEST_DEPLOYMENT.md` explizit von der Produktivumgebung getrennt (eigene
Testdaten, wird bei Redeploys zurückgesetzt) — ein Produktiv-Frontend an
den Lebenszyklus des Testsystems zu koppeln wäre fragil.

## GitHub Secrets — Stand 2026-10-09

Repo → Settings → Secrets and variables → Actions. `gh secret list` zeigt
nur Namen, keine Werte — ob ein Wert *sinnvoll* ist (nicht nur "irgendwas
gesetzt"), lässt sich von hier aus nicht prüfen.

### Gesetzt und in Benutzung

| Secret | Für | Workflow(s) |
|---|---|---|
| `SERVER_ADDRESS` | Alfahosting-Zielserver für sck-app (SCP) | web |
| `SSH_USER` | SSH-User für sck-app | web |
| `SSH_PASSWORD` | SSH-Passwort für sck-app | web |
| `SERVER_DIST_PATH_BASE` | Zielpfad für sck-app-Bundle | web |
| `SCK_API_URL` | API-Basis-URL, ins sck-app-Bundle einkompiliert | web |
| `COURSE_SHEET_URL` / `TRIP_SHEET_URL` | Google-Sheets-Links, ins sck-app-Bundle einkompiliert | web |

sck-admin-app und sck-api brauchen **keine** dieser Secrets — beide laufen
per Docker + self-hosted Runner auf eigener Infra, `SCK_API_URL`/
`TURNSTILE_SITE_KEY`/`ADMIN_APP_URL`/`SMTP_*`/`SEPA_ENCRYPTION_KEY`/etc.
liegen direkt in der `.env` auf dem jeweiligen LXC (`sck-admin-prod` bzw.
`sck-server`), nicht in GitHub Secrets (gleicher Mechanismus wie beim
Test-System — siehe `TEST_DEPLOYMENT.md`/`ADMIN_PROD_DEPLOY.md`). Die
Tabelle "Referenziert, aber nicht gesetzt" von vor dem Architekturwechsel
ist damit für sck-api obsolet (betraf die alte SSH-Pipeline).

### Gesetzt, aber ungenutzt (Altlasten)

Keine der folgenden wird von einem aktuellen Workflow referenziert
(`grep -rn "secrets\." .github/workflows` zeigt sie nicht) — vermutlich
Reste einer älteren Mail- bzw. Staging-Konfiguration. Vor dem Löschen kurz
prüfen, ob sie irgendwo außerhalb dieses Repos noch gebraucht werden.

- `CONFIRMATION_MAIL_SERVICE_MAIL` / `CONFIRMATION_MAIL_SERVICE_PASSWORD` / `CONFIRMATION_MAIL_SERVICE_SERVER`
- `SERVER_DIST_PATH_STAGE`
- `SERVER_DIST_PATH_ADMIN` (Rest von der ursprünglich geplanten SCP-Variante der Admin-App — durch den Umzug aufs eigene LXC jetzt komplett unbenutzt)
- `SMTP_SERVER` / `SMTP_PORT` / `SENDER_MAIL` / `SENDER_PW` / `SEPA_ENCRYPTION_KEY` / `SUPER_ADMIN_EMAIL` / `ADMIN_APP_URL` / `SCK_APP_URL` / `TURNSTILE_SECRET_KEY` (sofern als GitHub Secret angelegt) — seit dem Architekturwechsel 2026-10-18 lebt die sck-api-Konfiguration in der `.env` auf CT109, nicht mehr in GitHub Secrets

## Server-seitige Voraussetzungen (einmalig, nicht durch CI geprüft)

- **Apache-Vhost + TLS** für sck-app auf dem Alfahosting-Server — statisches
  Bundle, kein Node dahinter.
- **sck-admin-prod-LXC + Nginx-Proxy-Manager-Host** auf 5i1f4ng.de für die
  Admin-App — siehe ADMIN_PROD_DEPLOY.md.
- **sck-server-LXC (CT 109) + Nginx-Proxy-Manager-Host** auf 5i1f4ng.de für
  sck-api (Docker + self-hosted Runner, Label `sck-server`) — Setup-Schritte
  im Vault, `Projects/sck-api Produktiv-Deploy (CT109) — Setup.md`.
- **Backup des Datenverzeichnisses** (`sck-api-data`-Docker-Volume: SQLite-DB
  + `media/`-Ordner) — täglicher systemd-Timer auf CT109
  (`sck-server-backup.timer`, 03:30 Uhr) lädt per `rclone` nach Google Drive
  hoch, lokale Kopien werden nach 7 Tagen gelöscht. Das Docker-Volume ist
  vom Git-Checkout auf dem LXC komplett getrennt — ein `git reset --hard`
  im Deploy-Skript kann die echten Daten dadurch nicht mehr berühren (anders
  als beim alten SSH-Deploy, wo der Checkout selbst das Laufzeitverzeichnis
  war).

## Gelöst durch Architekturwechsel: `SCK-API Deploy` (SSH) war nie erfolgreich

Bis 2026-10-18 lief sck-api über SSH+systemd auf dem Alfahosting-Server
(`sck-api-build.yml` → `sck-api-deploy.yml`). `gh run list
--workflow="SCK-API Deploy"` zeigte seit Workflow-Erstellung (Juni 2025)
**vier Läufe, alle vier fehlgeschlagen** (zuletzt 2025-10-20), jeweils nach
15–25 Sekunden abgebrochen — zu kurz, um bis zum eigentlichen
Server-Setup-Skript zu kommen.

**Begründete Hypothese (nie bestätigt, da Logs nicht mehr abrufbar
waren):** `sck-web-app-build-deploy.yml` deployt mit denselben Secrets
(`SERVER_ADDRESS`/`SSH_USER`/`SSH_PASSWORD`) erfolgreich auf denselben
Server — die Zugangsdaten waren also gültig. Unterschied: `sshpass`+`scp`
(System-OpenSSH-Client) vs. `appleboy/ssh-action@v1.0.3` (eigener
Go-SSH-Client) im kaputten Workflow — ein bekanntes Fallstrick-Muster, bei
dem ein gebündelter Go-`crypto/ssh`-Client andere/weniger
Schlüsselaustausch-Algorithmen aushandelt als der System-OpenSSH-Client und
deshalb an einem `sshd` scheitert, der ältere Algorithmen deaktiviert hat.
Nützlich als Lehre für künftige SSH-basierte Action-Workflows, auch wenn es
hier nie verifiziert wurde — statt die Pipeline zu debuggen, wurde sck-api
stattdessen auf die bereits bewährte Docker+Runner-Architektur umgezogen
(siehe Tabelle oben, Vault-Doku für die vollständige Prozedur).
