# Status: Bild-Upload für Tiles (admin-app)

Ausgangsfrage war: wie sollen Tile-Bilder künftig verwaltet werden, wenn
Admins sie selbst hochladen können sollen, statt sie fest im Frontend-Build
(`src/web/projects/data/static/*.tile.ts`, `assets/img/...`) zu verdrahten?

**Ergebnis der Recherche: das ist bereits gebaut**, auf dem Branch/Worktree
`feature/admin-app` (`/home/cy/Workspace/skiclub-kapfenburg.de/feature/admin-app`).
Dieser Branch ist noch **nicht** in `release/2026-08-20` oder `master`
gemerged. Dieses Dokument hält fest, was dort existiert, was noch offen ist,
und was zu tun ist, wenn das Thema angegangen wird.

## Was bereits existiert (committed, `feature/admin-app`)

Ansatz: lokale Disk-Storage über `sck-api` selbst (kein externer Dienst) —
genau das Muster, das wir hier besprochen hatten (`sck-api` läuft dauerhaft
per systemd, keine ephemere Serverless-Umgebung, also ist lokale Disk
persistent und ausreichend).

- **`sck-api`** (`src/api/sck-api`):
  - `POST /images/upload` (`src/routes/images-route.ts`) — geschützt durch
    `requireAuth` + `requirePermission('tiles:write')`.
  - `src/services/upload-service.ts` — `multer.diskStorage` nach
    `dataDir/media`, Mime-Whitelist (png/jpeg/webp/gif/svg), 10 MB Limit.
  - `src/controllers/images-controller.ts` — liefert
    `{ id, filename, filepath, url, mimetype, size, uploadedAt }` zurück,
    `url` ist `/media/<filename>`.
  - `express.static('/media', mediaDir)` in `src/index.ts` liefert die
    Dateien wieder aus.
  - Kein eigenes DB-Table für Bilder — die Datei auf Disk ist der Record
    (wie bei `registrations.ndjson`).
  - `Tile`-Domain-Typ (`src/domain/tile.ts`) hat bereits `image: string` +
    `imageId?: string`; SQLite-Spalte `image_id` existiert
    (`src/db/connection.ts`).

- **`sck-admin-app`** (`src/web/projects/sck-admin-app`):
  - `editable-image` Komponente
    (`tile-management/components/editable-image/`) — Klick-zum-Hochladen,
    Ladeanimation, Entfernen-Button, ruft den Upload-Endpoint über
    `TilesDataService`.
  - Eingebunden im `tile-editor` (`tile-management/components/tile-editor/`).
  - `domain/image.ts` — `Image`-Interface passend zur API-Antwort.

- **`sck-app`** (öffentliche Website): Commit
  `9e01312 feat(sck-app): fetch tiles from sck-api at runtime instead of
  static @data imports` — der Umstieg von den fest eingebauten
  `data/static/*.tile.ts`-Dateien auf zur-Laufzeit von `sck-api` geladene
  Tiles ist auf diesem Branch bereits angefangen. Das ist der fehlende Teil,
  der macht, dass ein von einem Admin hochgeladenes Bild überhaupt auf der
  echten Website ankommt (aktuell, auf `release/2026-08-20`, liest `sck-app`
  weiterhin nur die statischen `.tile.ts`-Dateien).

## Was auf dem Branch noch uncommitted/in Arbeit ist

Stand `feature/admin-app`, Arbeitsverzeichnis nicht sauber:
- `src/scripts/migrate-tiles.ts` (einzelne Datei) wird zu
  `src/scripts/migrate-tiles/{index.ts, migrate.ts}` umgebaut.
- `src/db/connection.ts`, `src/domain/tile.ts`, `src/services/tiles-service.ts`
  haben zugehörige Anpassungen (u. a. offenbar rund um `image_id`).
- `src/__tests__/migrate-tiles.test.ts` entsprechend angepasst.
- `tsconfig.json` / `tsconfig.lint.json` / `package.json` / `pnpm-lock.yaml`
  ebenfalls verändert.

Dieser WIP-Stand war zuvor bewusst zurückgestellt und ist nicht Teil dieses
Dokuments — nur als Hinweis: bevor an diesem Branch weitergearbeitet wird,
zuerst `git status`/`git diff` in `feature/admin-app` prüfen, ob dieser Stand
noch relevant ist oder verworfen werden soll.

## Offene Punkte für den späteren Merge/Ausbau

1. **`sck-app` vollständig auf API-Tiles umstellen.** Commit `9e01312` ist
   der Anfang — prüfen, ob alle Tile-Quellen (Kurse, Gymnastik, Ausfahrten,
   Info-Tiles wie `programm.tile.ts`) schon migriert sind oder nur ein Teil.
   Die ganze in `release/2026-08-20` seit dieser Session neu entstandene
   Kalender-/Karussell-/Konsolidierungs-Arbeit (`home.component.ts`,
   `courses.component.ts`, `gym-general-information.component.ts` etc.)
   basiert noch auf den statischen `.tile.ts`-Imports (`projects/data/static`)
   — beim Merge muss abgeglichen werden, welche Tile-Daten/Felder
   (`schedule`, `imageOnly`, …) in `feature/admin-app`s `Tile`-Domain-Typ
   noch fehlen.
2. **Migrationsskript** (`migrate-tiles`) fertigstellen — überführt die
   bestehenden statischen Tile-Daten in die SQLite-DB, damit beim Umstieg
   keine Inhalte verloren gehen.
3. **Bestehende Bilder migrieren**: aktuelle `assets/img/...`-Dateien (Pilates,
   Programm, Skilift, Overview) einmalig in `dataDir/media` kopieren bzw. per
   Upload-Endpoint einspielen, damit die migrierten Tiles auf existierende
   Bild-URLs zeigen statt auf 404.
4. **Backup** des `dataDir` (SQLite-DB + `media/`-Ordner) auf dem Server
   sicherstellen, bevor produktiv genutzt wird — lokale Disk-Storage hat
   kein eingebautes Redundanz-/Backup-Konzept.
5. **Merge-Reihenfolge** klären: `feature/admin-app` ist inzwischen ein
   eigenständiger, großer Strang (Auth, Login, Rechte, SQLite, Tiles-API)
   parallel zu allem, was in `release/2026-08-20` seit der letzten
   gemeinsamen Basis passiert ist — Merge-Konflikte in `home.component.ts`,
   `courses.component.ts` etc. sind zu erwarten, da beide Branches an den
   Tile-Quellen arbeiten.

## Nicht Teil dieses Dokuments

Kein neuer Code wurde in diesem Schritt geschrieben — reine Bestandsaufnahme
und Wegweiser für die spätere Umsetzung, wie besprochen.
