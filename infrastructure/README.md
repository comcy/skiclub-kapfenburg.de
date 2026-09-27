# Deployment konfigurieren — Einstiegspunkt

Diese Datei beantwortet eine Frage: **was muss gesetzt sein, damit ein
Deploy dieses Systems funktioniert?** Für "was macht welcher Workflow"
siehe [CI_CD.md](./CI_CD.md), für die einmaligen Schritte beim
sck-admin-app-Produktiv-Deploy siehe [ADMIN_PROD_DEPLOY.md](./ADMIN_PROD_DEPLOY.md),
für das Docker-Testsystem siehe [TEST_DEPLOYMENT.md](./TEST_DEPLOYMENT.md).

Es gibt vier Deploy-Ziele, drei verschiedene Mechanismen:

| Ziel | Mechanismus | Workflow |
|---|---|---|
| Test-System (Docker, eine LXC) | Docker Compose, self-hosted Runner | `test-deploy.yml` |
| sck-app (Produktiv) | statisches Bundle per SCP auf Apache | `sck-web-app-build-deploy.yml` |
| sck-admin-app (Produktiv) | statisches Bundle per SCP auf Apache | `sck-admin-app-build-deploy.yml` |
| sck-api (Produktiv) | SSH + systemd-Service | `sck-api-build.yml` → `sck-api-deploy.yml` |

## GitHub Secrets — Stand 2026-09-27

Repo → Settings → Secrets and variables → Actions. `gh secret list` zeigt
nur Namen, keine Werte — ob ein Wert *sinnvoll* ist (nicht nur "irgendwas
gesetzt"), lässt sich von hier aus nicht prüfen.

### Gesetzt und in Benutzung

| Secret | Für | Workflow(s) |
|---|---|---|
| `SERVER_ADDRESS` | Zielserver für sck-app/sck-admin-app (SCP) und sck-api (SSH) | web, admin, api-deploy |
| `SSH_USER` | SSH-User für alle drei | web, admin, api-deploy |
| `SSH_PASSWORD` | SSH-Passwort für alle drei | web, admin, api-deploy |
| `SERVER_DIST_PATH_BASE` | Zielpfad für sck-app-Bundle | web |
| `SCK_API_URL` | API-Basis-URL, ins Frontend-Bundle einkompiliert | web, admin |
| `COURSE_SHEET_URL` / `TRIP_SHEET_URL` | Google-Sheets-Links, ins sck-app-Bundle einkompiliert | web |

### Referenziert, aber **nicht gesetzt** (Stand 2026-09-27)

Ein fehlendes Secret lässt den Workflow nicht fehlschlagen — es wird
stillschweigend zum leeren String. Das erklärt, warum ein "grüner" Deploy
trotzdem eine kaputte Konfiguration ausliefern kann.

| Secret | Für | Betrifft | Folge, wenn leer |
|---|---|---|---|
| `TURNSTILE_SITE_KEY` | Cloudflare-Turnstile-Widget im Frontend | web, admin | Captcha-Widget rendert mit leerem Site-Key — **das ist aktuell in Produktion der Fall**, sck-app deployt trotzdem erfolgreich |
| `SERVER_DIST_PATH_ADMIN` | Zielpfad für sck-admin-app-Bundle | admin | Guard-Schritt bricht kontrolliert ab (siehe ADMIN_PROD_DEPLOY.md) — kein Deploy ins Leere, aber auch kein Deploy |
| `ADMIN_APP_URL` | volle Admin-URL, u.a. Basis für Magic-Link-Mails | admin, api-deploy | sck-api fällt auf `http://localhost:4200` zurück — Login-Mails zeigen auf localhost |
| `SCK_APP_URL` | öffentliche Website-URL, für Mail-Links aus sck-api | api-deploy | sck-api fällt auf `http://localhost:4200` zurück |
| `SUPER_ADMIN_EMAIL` | erste Admin-Anmeldung (Bootstrap) in sck-api | api-deploy | niemand kann sich als Super-Admin einloggen |
| `SMTP_SERVER` / `SMTP_PORT` / `SENDER_MAIL` / `SENDER_PW` | Mailversand aus sck-api (Bestätigungsmails, Magic-Links) | api-deploy | sck-api loggt Mails nur nach stdout statt sie zu versenden (dev-Fallback, siehe `mailer.ts`) |
| `SEPA_ENCRYPTION_KEY` | Verschlüsselung der IBANs in der SQLite-DB | api-deploy | IBAN-Verschlüsselung schlägt fehl/liefert Unsinn — **vor produktivem SEPA-Export unbedingt prüfen** |
| `TURNSTILE_SECRET_KEY` | Server-seitige Captcha-Prüfung in sck-api | api-deploy | Captcha-Prüfung ist deaktiviert (loggt eine Warnung, blockt aber nichts — "fail open", siehe `turnstile-fail-open.test.ts`) |

### Gesetzt, aber ungenutzt (Altlasten)

Keine der folgenden wird von einem aktuellen Workflow referenziert
(`grep -rn "secrets\." .github/workflows` zeigt sie nicht) — vermutlich
Reste einer älteren Mail- bzw. Staging-Konfiguration. Vor dem Löschen kurz
prüfen, ob sie irgendwo außerhalb dieses Repos noch gebraucht werden.

- `CONFIRMATION_MAIL_SERVICE_MAIL` / `CONFIRMATION_MAIL_SERVICE_PASSWORD` / `CONFIRMATION_MAIL_SERVICE_SERVER`
- `SERVER_DIST_PATH_STAGE` (ADMIN_PROD_DEPLOY.md schlägt vor, es für `SERVER_DIST_PATH_ADMIN` umzubenennen statt ein neues Secret anzulegen)

## Server-seitige Voraussetzungen (einmalig, nicht durch CI geprüft)

- **Node-Version für sck-api:** `node:sqlite` (siehe `src/api/sck-api/src/db/connection.ts`)
  braucht Node ≥ 22.5. `node -v` auf dem Produktivserver prüfen, bevor der
  erste sck-api-Deploy scharf geschaltet wird.
- **Apache-Vhosts + TLS** für sck-app, sck-admin-app (eigene Subdomain,
  siehe ADMIN_PROD_DEPLOY.md) — statische Bundles, kein Node dahinter.
- **systemd** für sck-api — der Deploy schreibt
  `/etc/systemd/system/sck-api.service` aus
  `src/api/sck-api/systemd/sck-api.service.template` neu.
- **Backup des Datenverzeichnisses** (`dataDir`: SQLite-DB + `media/`-Ordner,
  siehe `src/api/sck-api/src/services/data-service.ts`) — der Deploy macht
  zwar selbst ein `cp -r`-Backup der laufenden Installation, das aber nach
  3 Tagen automatisch gelöscht wird (kein Ersatz für ein echtes Backup).
  **Achtung:** `git reset --hard origin/master` im Deploy-Skript überschreibt
  auch die im Repo getrackte `registrations.ndjson` mit dem Stand aus git —
  ein produktiver Datenstand dort würde beim nächsten Deploy verloren gehen.

## Bekanntes Problem: `SCK-API Deploy` ist noch nie erfolgreich gelaufen

`gh run list --workflow="SCK-API Deploy"` zeigt seit Erstellung des
Workflows (Juni 2025) insgesamt **vier Läufe, alle vier fehlgeschlagen**
(zuletzt 2025-10-20) — nicht nur "seit einer Weile kaputt", sondern **noch
nie erfolgreich durchgelaufen**. Alle vier brachen nach 15–25 Sekunden ab,
zu kurz, um bis zum eigentlichen Server-Setup-Skript zu kommen — die
GitHub-API liefert für den `deploy`-Job selbst keine Schritt-Details mehr
(Log-Retention abgelaufen, `410`/leeres `steps`-Array bei jedem der vier
Versuche, auch beim jüngsten von Oktober 2025).

**Was inzwischen dazugekommen ist, gegenüber der ursprünglichen Vermutung
"abgelaufenes `SSH_PASSWORD`":** `sck-web-app-build-deploy.yml` deployt mit
denselben drei Secrets (`SERVER_ADDRESS`/`SSH_USER`/`SSH_PASSWORD`) auf
denselben Server, zuletzt erfolgreich am 2026-08-22 — die Zugangsdaten sind
also nachweislich gültig und der Server nimmt SSH-Passwort-Logins von
GitHub-gehosteten Runnern an. Der Unterschied zwischen den beiden
Workflows: `sck-web-app-build-deploy.yml` verbindet sich mit dem
System-OpenSSH-Client (`sshpass` + `scp`), `sck-api-deploy.yml` mit der
Action `appleboy/ssh-action@v1.0.3` (eigener Go-SSH-Client). Das ist ein
bekanntes Fallstrick-Muster: die in `appleboy/ssh-action` gebündelte
Go-`crypto/ssh`-Version handelt teils andere/weniger Schlüsselaustausch-
oder Host-Key-Algorithmen aus als der System-OpenSSH-Client — falls der
Server-`sshd` ältere Algorithmen deaktiviert hat, verbindet sich `scp`
weiterhin, während `appleboy/ssh-action` beim Handshake scheitert. Das ist
eine begründete Hypothese, kein bestätigter Fund — die eigentliche
Fehlermeldung ist nicht mehr abrufbar.

**Vor dem ersten produktiven sck-api-Deploy also:**
1. Alle Secrets aus der Tabelle oben setzen.
2. Server-Node-Version prüfen (siehe oben).
3. Einen Testlauf beobachten (`gh run watch` nach dem Merge, der
   `SCK-API Build` auf `master` auslöst) und bei erneutem Scheitern sofort
   `gh run view <id> --log-failed` ziehen, solange die Logs noch frisch
   sind — danach mit der obigen Hypothese anfangen (SSH manuell testen,
   ggf. `appleboy/ssh-action` gegen `sshpass`/`scp` tauschen, analog zu den
   beiden funktionierenden Workflows).
