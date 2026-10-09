# Status: Admin-App, Datenbank-Backend, Bild-Upload

Ausgangsfrage war: wie sollen Tile-Bilder künftig verwaltet werden, wenn
Admins sie selbst hochladen können sollen, statt sie fest im Frontend-Build
zu verdrahten? Das führte zu einem größeren Schritt: Backend + Admin-App
von `feature/admin-app` additiv auf `release/2026-08-20` angebunden.

**Aktueller Stand: additiv angebunden, Pilot-Umfang Ausfahrten.** Statische
Tiles (`data/static/*.tile.ts`, `data/events/*.tile.ts`) bleiben exakt wie
sie sind, unverändert. Über die Admin-App neu angelegte **Ausfahrten**
(EventTile) erscheinen zusätzlich daneben — auf `/trips/overview`,
`/trips/prices`, `/trips/registration`, der Startseite (Kalender/Karussell)
und den Trip-Detailseiten. Kurse/Gymnastik/Info-Tiles sind noch **nicht**
angebunden — eigene, spätere Runde.

## Was jetzt läuft (auf `release/2026-08-20`, committed)

- **`sck-api`**: SQLite-Backend (Tiles/Boardings/Auth: Magic-Link + Google
  OAuth-Code + Invites/Users/Sessions/Permissions, Bild-Upload) aus
  `feature/admin-app` übernommen — additiv neben den bestehenden
  E-Mail-/Registrierungs-/Mitgliedschafts-Routen, nichts Bestehendes ersetzt.
  `Tile`-Domain-Typ trägt `tripConfig`/`course`/etc. opak in `extra_json`
  (JSON-Blob, nicht schema-validiert) — reicht für Ausfahrten-Pricing, ohne
  dass `sck-api` `TripConfig`/`GymCourseInformation` von Hand nachbilden muss.
  Bewusst **nicht** mitgenommen: `sepa-route.ts`/`sepa_data`-Tabelle
  (eigenständiges, ungenutztes Admin-Feature, um nicht mit der schon
  funktionierenden `sepa-data.ndjson`-Speicherung des Mitgliedsantrags zu
  kollidieren) und das `migrate-tiles`-Skript (zeigt auf veraltete
  Vor-Saison-Daten, nicht gebraucht solange statische Tiles Quelle der
  Wahrheit bleiben).
- **`sck-admin-app`**: komplett übernommen, eigenes Angular-CLI-Projekt,
  baut/lintet/testet über `build:admin`/`lint:admin`/`test:admin` (bewusst
  nicht in `web`s normale `build`/`test`/`lint`-Skripte gefaltet, da die vom
  `web`-Docker-Image aufgerufen werden — das soll nicht von der Admin-App
  abhängen). `scripts/verify.sh` deckt beides ab.
- **`docker-compose.yml`**: neuer `admin`-Service (Port 8081), `api`
  bekommt `SUPER_ADMIN_EMAIL`/`ADMIN_APP_URL`. `test-deploy.yml` +
  `setup-test-system.sh` bauen `api`/`web`/`admin` sequenziell (RAM-Grund,
  siehe `infrastructure/TEST_DEPLOYMENT.md`).
- **`sck-app`**: neuer `TripTilesApiService` (DI-Interface
  `TripTilesApiServiceInterface` in `trips-lib`, Implementierung in
  `sck-app`, gleiches Muster wie `TripRegistrationFormServiceInterface`) —
  holt `GET {sckApiUrl}/tiles?type=event`, hängt das Ergebnis an `TRIP_DATA`
  an. Fällt bei nicht erreichbarem Backend automatisch auf `TRIP_DATA` allein
  zurück (`catchError`) — eine tote DB-Verbindung darf die bestehende Seite
  nie mitreißen.

**Gefundener Bug beim Verifizieren:** `ChangeDetectionStrategy.Eager`
aktualisiert die Ansicht nicht zuverlässig nach einer async-Response aus
einer verschachtelten `switchMap`/`HttpClient`-Kette (beobachtet bei
`TripDetailComponent` — der Zustand war korrekt gesetzt, das Template zeigte
trotzdem den alten Stand). Alle sieben umgestellten Komponenten rufen jetzt
zur Sicherheit `ChangeDetectorRef.markForCheck()` nach dem async-Update auf.

## Offene Punkte

1. **Kurse/Gymnastik/Info-Tiles additiv anbinden** — gleiches Muster wie bei
   Ausfahrten, eigene Runde. `imageOnly` (Info-Tile-Feld) und
   `GymCourseSchedule` (Kurs-Feld) fehlen im `sck-api`-`Tile`-Typ als
   eigene Felder — würden aber genau wie `tripConfig` einfach über
   `extra_json` mitlaufen, kein Schema-Umbau nötig.
2. **Login/Bootstrap testen**: `SUPER_ADMIN_EMAIL` + `ADMIN_APP_URL` müssen
   in der `.env` auf der Test-LXC gesetzt werden (nur vom Nutzer selbst
   befüllbar), danach `docker compose up -d api` — siehe
   `infrastructure/TEST_DEPLOYMENT.md`.
3. **Bestehende Bilder migrieren**: aktuelle `assets/img/...`-Dateien
   einmalig in `dataDir/media` kopieren bzw. per Upload-Endpoint einspielen,
   falls/wenn Info-Tiles später auch über die DB laufen.
4. **Backup** des `dataDir` (SQLite-DB + `media/`-Ordner) auf dem Server
   sicherstellen, bevor produktiv genutzt wird.
5. **`master`-Merge**: dieser ganze Strang lebt bisher nur auf
   `release/2026-08-20`, noch nicht auf `master`/Produktiv.
