# Test-System: Setup & Betrieb

Containerisiertes Test-Deployment von `web` + `sck-api` + `admin`
(Admin-App) auf einer eigenen Proxmox-LXC, getrennt von der bestehenden
Produktivumgebung (die weiterhin unverändert über
`sck-web-app-build-deploy.yml` / `sck-api-deploy.yml` läuft). Reverse
Proxy + TLS übernimmt der bereits vorhandene Nginx Proxy Manager (NPM)
auf seiner eigenen LXC.

`sck-api` bedient hier zwei zunächst getrennte Zwecke: die bestehenden
Anmeldeformulare (E-Mail/Registrierung/Mitgliedschaft, unverändert) und
neu ein SQLite-Backend (Tiles/Boardings/Auth) für die Admin-App. Tiles,
die dort angelegt werden, erscheinen **zusätzlich** neben den weiterhin
bestehenden statischen Ausfahrten — kein Ersatz, siehe
`FEATURE_BRIEF_TILE_IMAGE_UPLOAD.md` für den Hintergrund.

## Einmaliges Setup

### 1. Alles auf einmal: LXC + Docker + Repo + `.env` + erster Start

**Läuft auf dem Proxmox-Host** (braucht `pct`/`pveam`, die gibt es nur
dort, nicht innerhalb einer LXC). Wie bei den bekannten Proxmox VE
Helper-Scripts genügt ein Einzeiler, kein vorheriges Klonen des Repos,
kein Editieren einer Config-Datei — jede Einstellung wird interaktiv
abgefragt (mit sinnvollen Defaults, „Standardeinstellungen
übernehmen? [Y/n]“ als Schnellweg):

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/comcy/skiclub-kapfenburg.de/master/infrastructure/proxmox/setup-test-system.sh)"
```

(`bash -c "$(curl ...)"`, nicht `curl | bash` — nur so bleibt die
Terminal-Eingabe für die Prompts unten frei. Liegt das Repo schon lokal
vor, geht auch einfach `bash infrastructure/proxmox/setup-test-system.sh`.)

**Zwei verschiedene „Branch“-Fragen, nicht verwechseln:** Die URL im
Einzeiler oben zeigt auf `master` — das ist nur, welche *Version des
Setup-Skripts selbst* geladen wird (ändert sich selten). Welcher
*App-Branch* tatsächlich in die LXC deployt wird, fragt das Skript
danach separat und bei jedem Lauf neu — z. B. `release/2026-08-20`,
solange der noch nicht gemerged ist.

Das Skript:

1. legt eine unprivilegierte Debian-12-LXC an — **oder**, falls unter
   der angegebenen VMID schon eine existiert, nutzt sie unverändert
   weiter (auch für eine LXC, die ihr selbst schon angelegt habt: deren
   VMID einfach bei der Abfrage eintragen),
2. installiert darin Docker Engine + Compose-Plugin (nur beim ersten
   Mal),
3. fragt, welcher App-Branch deployt werden soll, und klont/aktualisiert
   ihn nach `/opt/sck-test` in der LXC,
4. fragt interaktiv nach `.env`-Werten (SMTP, Sheet-URLs, API-URL,
   SEPA-Schlüssel, Admin-App-Zugang) — aber **nur nach denen, die dort
   noch nicht gesetzt sind**. Bereits vorhandene Werte bleiben
   unangetastet, keine Neueingabe nötig,
5. baut alle drei Images (nacheinander, siehe RAM-Hinweis unten) und
   startet den Stack (`docker compose up -d`) — **ohne** `down -v`, das
   `sck-api-data`-Volume mit euren Testdaten bleibt also über jeden
   erneuten Lauf hinweg erhalten.

Das Skript ist damit **beliebig oft wiederholbar** — für einen neuen
App-Branch zum Testen, ein Redeploy nach Codeänderungen oder um eine
neue Konfig-Variable nachzutragen (dann wird nur nach dieser einen
gefragt, alles andere bleibt wie es ist): Einzeiler einfach nochmal
ausführen. Testdaten und bereits gesetzte `.env`-Werte überleben das.

Danach bleiben nur zwei Dinge manuell übrig (siehe Schritt 2 + 3
unten): die Proxy Hosts in NPM und ein GitHub Actions Self-hosted
Runner auf der LXC für spätere Redeploys per Workflow.

**Zweites, unabhängiges Testsystem?** Beim Einzeiler-Lauf einfach eine
andere VMID/Hostname angeben — siehe Kommentar am Kopf des Skripts.

**RAM-Hinweis:** Der Default (`DEFAULT_MEMORY_MB=2048`, 2 GB) reicht
knapp nicht für einen `ng build` des Web-Frontends — beobachtet als
vom Linux-OOM-Killer abgeschossener Build (`SIGKILL` mitten in
`ng build sck-app`, teils auch als "runner lost communication with
the server", wenn die ganze LXC dabei kurzzeitig durchhängt). Sowohl
der Self-hosted-Runner-Workflow als auch dieses Setup-Skript bauen
`api`, `web` und `admin` deshalb nacheinander statt parallel (senkt
den Spitzenverbrauch), aber dauerhaft sicherer ist mehr RAM — mit drei
statt zwei Images empfohlen:
```bash
pct set <VMID> --memory 4096
pct reboot <VMID>
```

**Disk-Hinweis:** Der Default-Root-Disk (ca. 8G) reicht knapp nicht für
drei Node/Angular-Images nacheinander plus Docker-Build-Cache — beobachtet
als Deploy-Absturz mit `No space left on device`, teils schon beim
Runner selbst statt erst beim Build (siehe „Speicherplatz voll" unten).
Vergrößern auf dem Proxmox-Host, **relativ** zum aktuellen Stand
(`pct resize` kennt kein absolutes Zielmaß), Filesystem wird bei LXCs
automatisch mitvergrößert, kein Reboot nötig:
```bash
pct resize <VMID> rootfs +8G
```

### 2. Proxy Hosts in Nginx Proxy Manager anlegen

Im NPM-Web-UI, „Proxy Hosts" → „Add Proxy Host", für Web und API (Pflicht)
sowie optional Admin (diese Runde bewusst noch ohne — siehe Kontext oben,
Admin-App ist erreichbar aber noch nicht öffentlich verdrahtet):

| Feld | Web | API | Admin (optional) |
|---|---|---|---|
| Domain Names | `test.<eure-domain>` | `sck-api-test.<eure-domain>` | `admin-test.<eure-domain>` |
| Scheme | http | http | http |
| Forward Hostname/IP | IP der `sck-test`-LXC | IP der `sck-test`-LXC | IP der `sck-test`-LXC |
| Forward Port | `8080` | `3000` | `8081` |
| SSL | Let's Encrypt aktivieren, „Force SSL" | Let's Encrypt aktivieren, „Force SSL" | Let's Encrypt aktivieren, „Force SSL" |

Falls die API-Domain beim Skriptlauf noch nicht feststand: `.env` auf
der LXC nachtragen, dann `docker compose build web && docker compose
up -d web` — siehe „Konfiguration ändern" unten, warum das für `web`
einen Rebuild statt nur einen Neustart braucht. Legt ihr später einen
Proxy Host für Admin an, `ADMIN_APP_URL` in `.env` auf die echte Domain
ändern und `docker compose up -d api` (Laufzeit-Variable, kein Rebuild).

### 3. GitHub Actions Self-hosted Runner auf der LXC (optional)

Nur nötig, wenn ihr künftige Redeploys über die Actions-UI/Workflow
statt durch erneutes Ausführen des Setup-Skripts anstoßen wollt. Die
LXC hat weder einen offenen Port noch eine öffentliche DNS für SSH —
deshalb kein SSH-basierter Deploy von einem GitHub-gehosteten Runner
aus, sondern ein **Self-hosted Runner direkt auf der LXC**, der sich
ausgehend zu GitHub verbindet (kein offener Port, kein DNS nötig).
Läuft dort als systemd-Service, dediziert unter einem eigenen
`github-runner`-User (nicht root), mit dem Label `sck-test` — genau
das erwartet `test-deploy.yml` (`runs-on: [self-hosted, sck-test]`).

Einrichtung: Repo → Settings → Actions → Runners → „New self-hosted
runner", Linux/x64 wählen, das dort angezeigte Download/Configure-
Snippet auf der LXC ausführen. Als Service installieren: `sudo
./svc.sh install && sudo ./svc.sh start`. Danach zeigt derselbe
Runners-Tab den Runner als „Idle" mit dem Label `sck-test`.

Keine GitHub Secrets für diesen Workflow nötig — es wird nichts mehr
per SSH von außen verbunden.

**Einmalig auf der LXC nachziehen, falls `/opt/sck-test` schon vom
Setup-Skript (das als root läuft) angelegt wurde, bevor der
`github-runner`-User existierte** — sonst scheitert der erste
Runner-Deploy an Dateibesitz-Fehlern (git "dubious ownership",
Docker-Build-Fehler):
```bash
chown -R github-runner:github-runner /opt/sck-test
```

## Konfiguration ändern (SMTP, Sheet-URLs, API-URL, ...)

Alle Werte leben in **einer** Datei: `.env` in `/opt/sck-test` auf der
LXC (gitignored, wird von keinem `git pull`/Deploy angefasst). Wie eine
Änderung wirksam wird, hängt davon ab, **wann** der jeweilige Wert
gelesen wird:

- **Laufzeit-Variablen** (`sck-api` liest sie beim Start des Prozesses):
  `SMTP_SERVER`, `SMTP_PORT`, `SENDER_MAIL`, `SENDER_PW`,
  `SEPA_ENCRYPTION_KEY`, `SUPER_ADMIN_EMAIL`, `ADMIN_APP_URL`,
  `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
  (die drei Google-Werte sind optional — ohne sie funktioniert weiterhin
  der Magic-Link-Login, nur der "Mit Google anmelden"-Button nicht).
  Ändern →
  `.env` bearbeiten, dann reicht ein Neustart des `api`-Containers,
  **kein** Rebuild:
  ```bash
  docker compose up -d api
  ```
  `SEPA_ENCRYPTION_KEY` verschlüsselt die IBAN im Online-Mitgliedsantrag
  (siehe `src/api/sck-api/src/services/crypto-service.ts`) und wird
  nirgends außer in dieser `.env` gespeichert — ändert ihr ihn (oder
  fehlt er nach einem manuellen `.env`-Reset), sind zuvor gespeicherte
  IBANs nicht mehr entschlüsselbar. Das Setup-Skript generiert ihn
  deshalb nur beim allerersten Lauf und lässt einen einmal gesetzten
  Wert bei jedem weiteren Lauf unangetastet.
- **Build-Zeit-Variablen** (werden beim `ng build` fest in die
  ausgelieferten JS-Dateien eingesetzt, siehe
  `src/web/scripts/envsubst.sh` für `web` bzw. das simplere
  `sed`-Substitut in `src/web/projects/sck-admin-app/Dockerfile` für
  `admin`): `SCK_API_URL` (beide Images, dieselbe `sck-api`-Instanz),
  `COURSE_SHEET_URL`, `TRIP_SHEET_URL`. Ändern → `.env` bearbeiten, dann
  **muss** das jeweilige Image neu gebaut werden:
  ```bash
  docker compose build web && docker compose up -d web
  docker compose build admin && docker compose up -d admin
  ```

Faustregel: `api` ändert sich sofort mit `up -d`, `web`/`admin` brauchen
immer `build` davor.

## Alltag

**Automatisch:** Jeder Push auf einen `release/**`-Branch deployt
automatisch auf die Test-LXC — kein manueller Trigger nötig, sobald
der Self-hosted Runner eingerichtet ist (Schritt 3 oben).

**Neu deployen, für jeden anderen Branch on-demand** (nachdem der
Self-hosted Runner eingerichtet ist — Schritt 3 oben): GitHub →
Actions → „Test-System Deploy" → „Run workflow", Branch eingeben
(Default `master`). Funktioniert auch aus der GitHub-App unterwegs —
**Achtung:** der „Run workflow"-Button erscheint dort nur, wenn
`test-deploy.yml` auch auf dem Default-Branch (`master`) liegt, nicht
nur auf dem Feature-/Release-Branch, von dem aus ihr die Datei zuletzt
geändert habt.

**Logs ansehen:**
```bash
docker compose logs -f api
docker compose logs -f web
docker compose logs -f admin
```

**Testdaten zurücksetzen** (löscht `registrations.ndjson` im
`sck-api-data`-Volume):
```bash
docker compose down -v
docker compose up -d
```

**Speicherplatz voll** (Deploy scheitert mit `No space left on device`,
teils schon beim Runner selbst, bevor überhaupt gebaut wird): jeder
Deploy baut drei Images neu, `docker image prune -f` im Workflow räumt
danach nur ungetaggte Images weg, nicht den BuildKit-Cache — der wächst
über viele Deploys hinweg unbemerkt, bis die LXC-Disk voll ist. Ab
diesem Commit räumt der Workflow den Cache selbst auf
(`docker builder prune -f` nach dem Image-Prune), das beugt einem
erneuten Vollaufen vor — hilft aber nicht gegen eine **bereits volle**
Disk, das einmalig manuell aufräumen:
```bash
df -h /                    # bestätigen, dass die Disk wirklich voll ist
docker system df           # zeigt, wie viel davon Images/Build-Cache/Volumes sind
docker builder prune -af   # kompletter Build-Cache, nicht nur ungenutzter
docker image prune -af     # alle ungenutzten Images (nicht nur dangling)
df -h /                    # zur Kontrolle
```
`docker system prune -af --volumes` wäre aggressiver, aber Vorsicht:
`--volumes` würde auch das `sck-api-data`-Volume mit den Testdaten
löschen — dafür lieber gezielt `docker builder prune`/`docker image
prune` wie oben, Volumes nicht anfassen.

Löst das Docker-Aufräumen allein nicht genug Platz (Docker selbst
macht oft nur einen Bruchteil der belegten Disk aus - `du -xhd1 /
| sort -rh` zeigt die tatsächlich großen Verzeichnisse), war bei uns
am 2026-09-04 der eigentliche Übeltäter der **Self-Update-Cache des
Runners** unter `_work/_update` (übrig gebliebenes, nie aufgeräumtes
Runner-Package von einem durch die volle Disk abgebrochenen
Selbstupdate - ~680M, reiner Update-Cache, nichts von Job-Daten):
```bash
cd /opt/github-runner
sudo ./svc.sh stop
rm -rf _work/_update
sudo ./svc.sh start
```

**Manuell neu bauen/starten** (ohne CI, z. B. um einen anderen Branch
zu testen):
```bash
cd /opt/sck-test
git fetch && git checkout <branch>
docker compose build
docker compose up -d
```
