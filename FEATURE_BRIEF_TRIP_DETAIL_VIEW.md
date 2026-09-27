# Feature: Trip-Vollbildansicht

Aktuell zeigen die Trip-Kacheln auf der Startseite (`home.component.html`)
sehr viel Information direkt inline (Titel, Datum, Untertitel, volle
`description`/`details` als Markdown, Status-Stempel, Aktions-Buttons).
Klick auf "Anmelden" öffnet einen Dialog über ein Named-Router-Outlet
(`openRegisterDialog` → `{ outlets: { modal: ['register', tile.id] } }}`).
Es gibt außerdem einen nie fertiggestellten `openDetailDialog`-Ansatz (im
Code als auskommentierter Button-Verweis sichtbar), der genau in diese
Richtung zielte.

Dieses Briefing ist das Ergebnis einer `/grilling`-Runde mit dem Repo-Owner.
Alle Punkte unten sind **entschieden**. Bei echten Unklarheiten während der
Umsetzung: sinnvolle, minimal-invasive Annahme treffen und im
Abschlussbericht explizit benennen.

## Settled Design

- **Echte eigene Route pro Trip**, z. B. `/trips/<tile-id>` (die Tiles haben
  bereits stabile `id`-Felder, siehe z. B. `projects/data/events/*.tile.ts`)
  — bookmarkbar, teilbar, im Browser-Verlauf sichtbar. **Kein Modal.**
- **Kachel wird Teaser**: Titel, Datum, Bild, Status-Stempel
  (Abgesagt/Warteliste) bleiben auf der Kachel in `home.component.html`.
  `description` und `details` (beides Markdown, siehe
  `getTileDescription(t)` in `home.component.ts` bzw. `t.details`) werden
  von der Kachel entfernt und wandern komplett auf die neue Detailseite.
- **Anmeldeformular fest eingebettet** auf der Detailseite, immer sichtbar
  (kein zusätzlicher Klick, kein Ein-/Ausklappen) — die bestehende
  `trips-registration-form`-Komponente (`projects/trips-lib/src/lib/ui/trips-registration-form/`)
  wiederverwenden, nicht neu bauen.
- **Ein einziger Einstiegspunkt**: Kachel-Klick navigiert direkt zur
  Detailseite (kein Dialog mehr als Alternative). Der bestehende
  Dialog-Code (`TripsRegisterDialogComponent`,
  `openRegisterDialog`-Route) bleibt unangetastet im Code liegen (falls noch
  alte Links/Bookmarks darauf zeigen), wird aber von der Kachel aus nicht
  mehr aktiv verlinkt.
- **Datenquelle: zunächst weiterhin statisch.** Baut gegen die aktuellen
  `TRIP_DATA`-Importe (`@data`), **nicht** gegen eine zukünftige Backend-API
  (die entsteht in einem parallelen Feature/Worktree namens
  `feature/admin-app` — bewusst unabhängig gehalten). Die Detail-Komponente
  sollte ihre Trip-Daten aber über eine klar benannte Methode/einen Service
  beziehen, damit der spätere Umstieg auf einen API-Abruf nur ein Austausch
  der Datenquelle hinter derselben Komponente ist, kein Strukturumbau.

## Was zu bauen ist

Alles innerhalb `src/web`, ausschließlich Frontend, kein Backend-Anteil.

- Neue Detail-Komponente in `projects/trips-lib` (z. B.
  `feature/trip-detail/trip-detail.component.ts` — an bestehender
  Verzeichnisstruktur in `trips-lib/src/lib/feature/` orientieren).
- Neuer Routeneintrag in `projects/sck-app/src/app/trips/trips-routing.module.ts`
  (oder wo Trip-Routen aktuell definiert sind) für `/trips/:id`, lädt die
  neue Detail-Komponente, löst `:id` gegen `TRIP_DATA` auf.
- `home.component.html`/`.ts` anpassen: Kachel-Markup auf Teaser reduzieren,
  Klick-Handler navigiert zur neuen Route statt `openRegisterDialog`
  aufzurufen (der Registrieren-Button auf der Kachel selbst kann ganz
  entfallen oder ebenfalls zur Detailseite führen — beides ist im Sinne von
  "ein Einstiegspunkt", entscheide sinnvoll und dokumentiere die Wahl).
- Detailseite: Rendering von `description`/`details` (Markdown, wie bisher
  über `MarkdownRenderService`), plus eingebettetes
  `trips-registration-form`.

## Verifikation vor Abschluss

- `bash scripts/verify.sh --filter web` muss grün sein.
- `pnpm --filter web exec ng serve sck-app`: Klick auf eine Trip-Kachel führt
  zu einer eigenen URL (`/trips/...`), die Seite zeigt vollen Inhalt +
  funktionierendes, eingebettetes Anmeldeformular.
- Alte Kachel-Buttons (Download/Share) für Nicht-Register-Aktionen bleiben
  unverändert funktionsfähig — nur der Anmelden-Weg ändert sich.
