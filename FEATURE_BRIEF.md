# Feature: sck-admin-app

Admin-Oberfläche zur Verwaltung der öffentlichen Vereins-Website: Tiles
(Events/Kurse/Info-Seiten) und Boardings (Bus-Zustiegsorte) bearbeiten, ohne
dass dafür ein Deploy nötig ist.

Dieses Briefing ist das Ergebnis einer ausführlichen `/grilling`-Runde mit dem
Repo-Owner. Alle Punkte unten sind **entschieden**, nicht offen — bei echten
Unklarheiten während der Umsetzung: sinnvolle, minimal-invasive Annahme
treffen und im Abschlussbericht explizit benennen, nicht raten und
verschweigen.

## Ausgangslage in diesem Worktree

- `src/web/projects/sck-admin-app/**` wurde bereits aus einem alten,
  weit zurückliegenden Branch (`features/data-persistence-and-register-improvements`)
  hierher kopiert und in `angular.json` verdrahtet. Baut und lintet aktuell
  sauber (`pnpm --filter web run build`, `pnpm exec eslint "projects/sck-admin-app/**/*.ts"`
  in `src/web/`).
- **Bereits entfernt**: alle Registration-Management-Routen/-Komponenten aus
  dem alten Branch (`TripsRegistrationListComponent`, `courses`-Route) — die
  waren überholt durch Arbeit, die seitdem in diesem Repo passiert ist, und
  sind explizit **nicht** Teil dieses Features. Nicht wieder einbauen.
- Übrig geblieben und Ausgangspunkt: `event-management` mit `tile-management/`
  (Tile-Editor, -Liste, -Preview, editierbare Felder für Datum/Bild/Link/Text)
  und `boardings-management/` (Boardings-CRUD).
- Die Services (`tiles-data.service.ts`, `boardings-data.service.ts`)
  erwarten eine REST-API unter `http://localhost:3000/api/{tiles,boardings,images/upload}`,
  die **in keinem Branch existiert** — nur das Frontend + der Vertrag
  existieren bisher. Backend ist komplett neu zu bauen.
- Ein paar `*ngIf`/`CommonModule`-Reste wurden schon auf die aktuelle
  Control-Flow-Syntax (`@if`) umgestellt, `.eslintrc.json` (altes Format)
  entfernt (Repo nutzt jetzt Flat-Config, `eslint.config.js` im Root deckt
  `sck-admin-app` automatisch mit ab — `prefix: 'app'` ist dort bereits
  generisch für alle Apps gesetzt).
- **Bekannte Lücke, nicht blockierend**: `sck-admin-app` hat eigene
  `.spec.ts`-Dateien, aber `pnpm --filter web run test` läuft aktuell nur
  gegen `sck-app` (hartcodiert im `test`-Script). Beim Ausbau der Testabdeckung
  (siehe unten) mit einplanen, dieses Script auf beide Projekte auszuweiten.

## Settled Design

### Datenhaltung
SQLite (eine Datei, kein DB-Server) in `src/api/sck-api`. Ersetzt künftig die
statischen Tile-TS-Dateien in `src/web/projects/data/`. Die ~20 bestehenden
Tiles (Events, Kurse, Info-Seiten) werden im Rahmen dieses Features **einmalig
importiert** — Migrationsskript schreiben, gegen den finalen Schema-Stand
laufen lassen, danach kann es bleiben (Referenzskript) oder als npm-Script
im `sck-api`-package.json verankert werden. Externe Bild-URLs bei
migrierten Tiles unverändert übernehmen, nicht neu hochladen.

### Öffentliche Seite (`sck-app`)
Wird in diesem Feature auf Laufzeit-Abruf der Tiles von `sck-api` umgestellt
(echtes CMS-Verhalten statt Compile-Time-Daten aus `projects/data/`). Betrifft
v. a. `home.component.ts` (`ngOnInit`), ggf. weitere Stellen, die aktuell aus
`@data` importieren. Das ist ein zentraler Teil des Werts dieses Features —
nicht als "später" abschieben.

### Auth
- Login per **Magic-Link oder Google-OAuth**, beide gleichzeitig als Wahl auf
  dem Login-Screen (kein Umschalter, keine Konfiguration nötig).
- Zugang **nur** für vorher per Einladungslink eingeladene E-Mail-Adressen.
  Wichtig: auch beim Google-Login wird die eingeloggte Mail gegen die
  Allowlist/Invite-Tabelle geprüft — ein gültiges Google-Konto reicht nicht,
  wenn die Mail nicht eingeladen wurde.
- Keine Selbstregistrierung, keine offene Signup-Route.

### Rollen/Rechte
- Neu eingeladene Nutzer starten mit **rein lesendem** Zugriff.
- Freischaltung weiterer Rechte erfolgt granular durch den Admin (Repo-Owner)
  über die UI — kein Self-Service.
- Rechte-Modell muss **mehrwertig** sein, nicht binär (nicht nur
  "read"/"editor"): mindestens ein eigenes, getrenntes Recht für
  **SEPA-/Finanzdaten-Einsicht** (aus dem Membership-Registration-Feature,
  läuft in einem parallelen Worktree — falls dessen Migrations/Tabellen noch
  nicht existieren, das Rechte-Konzept trotzdem schon so anlegen, dass sich
  dieses Recht später einfach ergänzen lässt, ohne das Schema umzubauen).

### Boardings
Globaler, weitgehend statischer Katalog (`{id, name}`, siehe
`boardings-management/domain/boarding.ts` im bereits kopierten Code). Pro
Ausfahrt wird eine Teilmenge zugewiesen — das bestehende
`Trip.availableBoardings: string[]`-Feld (aktuell hart pro Tile-Datei kodiert)
ist das Vorbild für die Zielstruktur; braucht eine Zuordnungstabelle
(trip_boardings) statt der Katalog-Tabelle allein.

### UI-Herkunft
Bestehender, bereits kopierter Code wird **übernommen und angepasst**, nicht
neu gebaut — auf aktuelle Konventionen hin geprüft (Control-Flow-Syntax
größtenteils schon erledigt, aber nochmal komplett durchsehen), nicht
1:1-Wegwerfen und neu schreiben.

## Was zu bauen ist (Backend, `src/api/sck-api`)

Vorbild für Struktur/Fehlerbehandlung: `src/controllers/registration-controller.ts`,
`src/controllers/email-controller.ts`.

- SQLite-Anbindung + Schema: `tiles`, `boardings`, `trip_boardings`, `users`,
  `invites`, `permissions` (mehrwertig, s.o.), `sepa_data` (separate Tabelle,
  s. Membership-Feature — Tabelle kann hier bereits vorgesehen, aber leer
  bleiben, falls das andere Feature noch nicht so weit ist).
- Migrationsskript für die ~20 bestehenden Tiles.
- CRUD-Routen `/api/tiles`, `/api/boardings`, Zuordnungsroute für
  Trip-Boardings, `/api/images/upload` (lokal auf der Platte des Servers
  speichern, analog zu `data/registrations.ndjson`).
- Auth-Routen: Magic-Link anfordern/verifizieren, Google-OAuth
  Start/Callback, Invite erzeugen/annehmen.
- Rechte-Middleware, die die neuen Routen entsprechend absichert.

## Was zu bauen ist (Frontend, `src/web/projects/sck-admin-app`)

- Admin-UI weiter an aktuelle Konventionen anpassen, gegen die neue API
  verdrahten (aktuell zeigt `TilesDataService`/`BoardingsDataService` fest auf
  `http://localhost:3000/api` — auf ein Environment-Pattern wie in `sck-app`
  umstellen).
- Login-Screen (Magic-Link + Google-Button), Invite-Annahme-Flow,
  rechte-abhängiges Ein-/Ausblenden von Aktionen in der UI.
- Trip-Boarding-Zuordnung in der bestehenden Tile-Editor-UI ergänzen.

Und in `src/web/projects/sck-app`:
- `home.component.ts` (und was sonst `@data` importiert) auf Laufzeit-API-Abruf
  umstellen statt statischer Imports.

## Verifikation vor Abschluss

- `bash scripts/verify.sh --filter web` und `bash scripts/verify.sh --filter sck-api`
  (oder ohne `--filter` für beide) müssen grün sein.
- `pnpm --filter web exec ng serve sck-admin-app` startet, Login funktioniert
  nur für eingeladene Mails (beide Methoden testen), Tiles/Boardings lassen
  sich anlegen/bearbeiten/löschen.
- Öffentliche Seite (`pnpm --filter web exec ng serve sck-app`) zeigt Tiles,
  die über die Admin-App geändert wurden, ohne Neu-Deploy.
- SEPA-Daten (sobald die Tabelle befüllt ist) sind ohne das granulare Recht
  nicht abrufbar — kurzer Test mit einem Nutzer ohne dieses Recht.
