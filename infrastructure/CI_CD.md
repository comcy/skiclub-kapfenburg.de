# CI/CD-Übersicht

Alle GitHub-Actions-Workflows in `.github/workflows/`, was sie triggert,
was sie ausführen und wohin sie deployen. Stand: 2026-09-06.

## Kurzfassung: Wer testet was, wann?

| Workflow | Trigger | Tests? | Deploy-Ziel |
|---|---|---|---|
| `test-deploy.yml` | Push auf `release/**`, manuell | ✅ `scripts/verify.sh` (gesamtes Workspace) – **gate** für den Deploy | Test-LXC (Docker) |
| `sck-web-app-build-deploy.yml` | Push auf `master` (nur `src/web/**`) | ✅ `pnpm --filter web run test` (nur sck-app) | Produktiv-Server (SCP) |
| `sck-admin-app-build-deploy.yml` | Push auf `master` (admin + geteilte Libraries) | ✅ `lint:admin` + `test:admin` | Produktiv-Server (SCP) — siehe [ADMIN_PROD_DEPLOY.md](./ADMIN_PROD_DEPLOY.md) |
| `sck-api-build.yml` | Push/PR auf `master` (nur `src/api/sck-api/**`) | ✅ `pnpm --filter sck-api test` | – (nur Build-Artefakt) |
| `sck-api-deploy.yml` | `sck-api-build.yml` erfolgreich auf `master` | ❌ (verlässt sich auf den Build-Workflow) | Produktiv-Server (SSH/systemd) |
| `e2e-tests.yml` | PR gegen `master` (nur `src/web/**`, `e2e/**`) | ✅ Playwright-E2E-Suite | – (reiner Check) |

**Wichtigster Punkt für die tägliche Arbeit auf `release/**`-Branches**
(worauf dieses Repo seit dem Test-System-Aufbau primär arbeitet):
`test-deploy.yml` ist seit 2026-09-06 zweistufig — ein `test`-Job auf
einem GitHub-gehosteten Runner läuft `scripts/verify.sh` (Build + Lint +
Test für **jedes** Workspace-Paket: sck-api, sck-app, sck-admin-app,
alle sechs Angular-Libraries, sowie die E2E-Suite). Der `deploy`-Job
läuft nur, wenn das grün ist (`needs: test`). Davor lief bei jedem Push
auf `release/**` **kein einziger Test** — nur `docker compose build`,
das lediglich TypeScript-Kompilierfehler abfängt, keine Logikfehler.

## Workflow für Workflow

### `test-deploy.yml` — Test-System (Docker, self-hosted Runner)

- **Trigger:** jeder Push auf `release/**`; `workflow_dispatch` für
  einen beliebigen Branch (Default `master`) — praktisch z. B. von der
  GitHub-Mobile-App aus, ohne am Rechner zu sein.
- **`test`-Job** (`ubuntu-latest`, GitHub-gehostet — bewusst NICHT der
  `sck-test`-Runner, dessen 2 GB RAM schon für die drei sequenziellen
  Docker-Builds knapp bemessen sind): `pnpm install`, Playwright-
  Browser installieren, dann `bash scripts/verify.sh`.
- **`deploy`-Job** (`needs: test`, läuft auf `[self-hosted, sck-test]`):
  Checkout des Ziel-Branches direkt auf der LXC, sequenzielles
  `docker compose build` für `api`/`web`/`admin` (RAM-Grund siehe
  Kommentar im Workflow), `docker compose up -d`, Image-/Build-Cache-
  Pruning, einfacher HTTP-Healthcheck auf allen drei Services.
- Details zum Runner-Setup, `.env`, Disk-Space-Fallstricke:
  [TEST_DEPLOYMENT.md](./TEST_DEPLOYMENT.md).

### `sck-web-app-build-deploy.yml` — Produktiv-Deploy, sck-app

- **Trigger:** Push auf `master`, nur bei Änderungen unter `src/web/**`.
- Env-Substitution (`envsubst.sh`) für `COURSE_SHEET_URL`/
  `TRIP_SHEET_URL`/`SCK_API_URL`/`TURNSTILE_SITE_KEY` aus Secrets, dann
  **Tests** (`pnpm --filter web run test` — nur `sck-app`, nicht die
  anderen Workspace-Pakete; war bis 2026-09-06 auskommentiert, siehe
  „Bekannte Lücken" unten), dann Build, dann `scp` des `dist/`-Ordners
  direkt auf den Produktiv-Server.
- Älterer Deploy-Mechanismus als `test-deploy.yml` (direktes SCP statt
  Docker) — beide bewusst getrennt, siehe `TEST_DEPLOYMENT.md`s
  einleitender Kommentar.

### `sck-admin-app-build-deploy.yml` — Produktiv-Deploy, sck-admin-app

- **Trigger:** Push auf `master`, bei Änderungen unter
  `src/web/projects/sck-admin-app/**` oder den geteilten Angular-
  Libraries (shared-lib, gym-lib, courses-lib, trips-lib, data).
- Gleicher Mechanismus wie `sck-web-app-build-deploy.yml` (SCP auf
  denselben Apache-Server), aber `sed`-basierte Env-Injection statt
  `envsubst.sh` (admin hat nur 2 Felder: `sckApiUrl`, `turnstileSiteKey` —
  gleiches Muster wie im bestehenden Test-Docker-Image).
- Ein Guard-Schritt bricht kontrolliert ab, solange
  `SERVER_DIST_PATH_ADMIN`/`ADMIN_APP_URL` noch nicht als Secrets gesetzt
  sind — verhindert ein Deploy ins Leere (leeres Ziel-Secret würde `scp`
  sonst ins Home-Verzeichnis des SSH-Users kopieren lassen). Einmalige
  manuelle Schritte (DNS, Apache-Vhost, Secrets) siehe
  [ADMIN_PROD_DEPLOY.md](./ADMIN_PROD_DEPLOY.md).

### `sck-api-build.yml` + `sck-api-deploy.yml` — Produktiv-Deploy, sck-api

- **Build:** Push/PR auf `master`, nur bei Änderungen unter
  `src/api/sck-api/**`. Installiert, testet (`pnpm --filter sck-api
  test` — nur `jest`, nicht `tsc --noEmit`/`lint` trotz
  Schritt-Kommentar „Run linting and tests"), baut, lädt bei Erfolg auf
  `master` das `dist/`-Artefakt hoch.
- **Deploy:** reagiert per `workflow_run` auf den erfolgreichen
  Abschluss von „SCK-API Build" auf `master` — SSH auf den
  Produktiv-Server, Backup der laufenden Installation, Neuinstallation,
  systemd-Service aus Template neu schreiben (Secrets per `envsubst`),
  Service-Neustart + Health-Check.
- `workflow_run` triggert nur für Workflow-Dateien, die auf dem
  Default-Branch (`master`) liegen — funktioniert deshalb hier
  zuverlässig, wäre aber die falsche Wahl für einen `release/**`-Branch
  (siehe warum `test-deploy.yml` stattdessen zwei Jobs in einer Datei
  mit `needs:` verwendet).

### `e2e-tests.yml` — reiner PR-Check

- **Trigger:** nur Pull Requests gegen `master`, nur bei Änderungen
  unter `src/web/**`/`e2e/**`.
- Installiert Playwright-Browser, führt `pnpm --filter e2e test` aus.
  Lädt bei Fehlschlag den Playwright-Report als Artefakt hoch.
- Kein Deploy, reiner Merge-Gate für PRs — betrifft `release/**`-Pushes
  nicht (die laufen nicht über einen PR gegen `master`).

## Bekannte Lücken (nicht Teil der 2026-09-06-Änderung, bewusst nicht
angefasst — hier nur dokumentiert)

- **`sck-api-build.yml`/`e2e-tests.yml` laufen nur für `master`.** Ein
  Push auf einen `release/**`-Branch bekommt dadurch kein PR-artiges
  Feedback von diesen beiden — ist inzwischen aber durch
  `test-deploy.yml`s neuen `test`-Job abgedeckt, der bei jedem
  `release/**`-Push ohnehin das gesamte Workspace (inkl. sck-api und
  E2E) prüft.
- **`sck-web-app-build-deploy.yml` testet nur `sck-app`**, nicht
  `sck-admin-app` oder die Angular-Libraries — anders als
  `test-deploy.yml`s `scripts/verify.sh`, das alles abdeckt. Ein
  vollständigerer Produktiv-Gate (analog zu `test-deploy.yml`) wäre
  möglich, aber ein separater, bewusster Schritt (höhere Tragweite,
  echter Produktiv-Server statt Test-LXC).
- **`sck-api-deploy.yml` ist noch nie erfolgreich gelaufen** — nicht nur
  "seit einer Weile kaputt": `gh run list --workflow="SCK-API Deploy"`
  zeigt seit Erstellung des Workflows (Juni 2025) insgesamt vier Läufe,
  alle `failure`, jeweils ~15–25s Laufzeit (zu kurz für das eigentliche
  Server-Setup-Skript). Logs über die GitHub-API nicht mehr abrufbar
  (Retention abgelaufen, auch beim jüngsten Lauf von Oktober 2025). Neuer
  Anhaltspunkt gegenüber der ursprünglichen "SSH_PASSWORD abgelaufen"-
  Vermutung: `sck-web-app-build-deploy.yml` deployt mit denselben
  `SERVER_ADDRESS`/`SSH_USER`/`SSH_PASSWORD`-Secrets auf denselben Server
  zuverlässig (zuletzt erfolgreich 2026-08-22) — die Zugangsdaten sind
  also gültig. Unterschied: dieser Workflow verbindet sich per
  `appleboy/ssh-action` (eigener Go-SSH-Client) statt per System-SSH
  (`sshpass`+`scp`) wie die funktionierenden Workflows — mögliche
  Algorithmus-Inkompatibilität mit dem Server-`sshd`, nicht bestätigt.
  Volle Analyse und die vollständige Secrets-Tabelle:
  [`README.md`](./README.md). Separat dabei gefunden und behoben: eine
  falsche relative Pfadangabe für das systemd-Template
  (`systemd/sck-api.service.template` statt
  `src/api/sck-api/systemd/sck-api.service.template`).
- **`sck-api-build.yml`s Test-Schritt-Kommentar ist ungenau**
  ("Run linting and tests" führt nur `jest`, kein `tsc --noEmit`
  gesondert aus — `pnpm --filter sck-api test`s package.json-Skript
  heißt nur `test`, `lint` ist ein separates Skript, das hier nicht
  aufgerufen wird).

## `scripts/verify.sh` — ein Skript für lokal und CI

Absichtlich der **einzige** Ort, der weiß, wie man den gesamten
Workspace baut/lintet/testet — lokal identisch zu CI aufrufbar:

```bash
bash scripts/verify.sh              # alles
bash scripts/verify.sh --filter web # nur ein Paket
```

Erkennt `CHROME_BIN` automatisch (für die Karma-Suiten der
Angular-Projekte), installiert selbst aber keine Browser — Playwright
(E2E) und ein System-Chrome/Chromium müssen vorher vorhanden sein
(lokal i. d. R. schon installiert, in CI per eigenem Setup-Schritt, wie
in `test-deploy.yml`s `test`-Job zu sehen).
