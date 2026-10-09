# Feature: Mitglieder-Onlineformular

Aktuell verlinkt `membership.tile.ts`
(`src/web/projects/data/static/membership.tile.ts`) per
`TileActions.Download` auf ein PDF (OneDrive) — den Papier-Mitgliedsantrag,
den man ausdrucken, ausfüllen und einreichen muss. Ziel: Mitgliedschaft soll
komplett online beantragbar sein. `membership-lib`
(`src/web/projects/membership-lib`) ist aktuell ein leeres
`ng generate library`-Gerüst (Default-Komponente/-Service, keine echte
Logik) — hier entsteht die eigentliche Funktionalität.

Dieses Briefing ist das Ergebnis einer `/grilling`-Runde mit dem Repo-Owner.
Alle Punkte unten sind **entschieden**. Bei echten Unklarheiten während der
Umsetzung: sinnvolle, minimal-invasive Annahme treffen und im
Abschlussbericht explizit benennen.

## Settled Design

### Formularfelder
Name, Geburtstag, Adresse, E-Mail, Telefon, Familienmitgliedschaft (Ja/Nein
— bei Ja: beliebig viele weitere Personen hinzufügbar, je mit Name +
Geburtstag), SEPA/IBAN + Lastschriftmandat-Checkbox ("hiermit erteile ich
das Lastschriftmandat"), eine "Erklärung gelesen"-Checkbox (allgemeine
Beitrittserklärung/Satzungs-Zustimmung, analog zum bestehenden AGB-Muster),
eine separate "Datenschutz gelesen"-Checkbox mit Link zur Datenschutzseite
(Route existiert bereits, siehe `DSGVO_ROUTE`/`DatenschutzComponent` in
`shared-lib`).

Für Formularaufbau, Service-Interface-als-DI-Token-Pattern, Submit-Flow und
das "weitere Person hinzufügen"-Muster (dynamisches FormArray) als Vorbild
nehmen: `projects/trips-lib/src/lib/ui/trips-registration-form/` (insb.
`addParticipant()`/`participants()`-FormArray-Handling) und
`projects/courses-lib/src/lib/ui/course-registration-form/`. Für die
AGB/Datenschutz-Checkbox-Optik: `projects/trips-lib/src/lib/ui/agb-dialog/`.

### SEPA/IBAN-Handling — sicherheitskritisch, nicht überspringen
- Getrennt von den übrigen Registrierungsdaten gespeichert (eigene Tabelle,
  nicht in derselben Datei/Tabelle wie Name/Adresse/etc.).
- Feldweise verschlüsselt (nicht die ganze Datenbank/Datei — nur das
  IBAN-Feld), Schlüssel aus einer Umgebungsvariable außerhalb der
  Datenbank, nicht hartkodiert, nicht mit eingecheckt.
- Einsicht nur mit einem eigenen, granularen Recht (nicht demselben, das
  z. B. Tiles bearbeiten erlaubt) — dieses Rechte-Modell entsteht in einem
  parallelen Feature/Worktree (`feature/admin-app`, SQLite + Auth). Falls
  dessen Rechte-/Nutzertabellen bei deiner Arbeit noch nicht existieren:
  eigene `sepa_data`-Tabelle trotzdem klar getrennt anlegen und in
  `sck-api` vorbereiten, so dass sie sich später einfach an das dortige
  Rechte-Modell anschließen lässt, ohne Schema-Bruch. Nicht auf das andere
  Feature warten.

### Nach dem Absenden
- Speichern (inkl. verschlüsseltem SEPA-Feld) + **Bestätigungsmail an den
  Antragsteller** (reine Eingangsbestätigung mit den eingegebenen Daten zur
  Kontrolle — Vorbild: `getTripConfirmationMailText` /
  `trip-confirmation-mail.function.ts` in `projects/data/mail-templates/`).
- **Separate Benachrichtigungsmail an Vorstand/Kassenwart** (fixe
  Empfänger-Liste, analog zu `getTripConfirmationMailBcc` — SEPA/IBAN
  **nicht** im Klartext in diese Mail schreiben, nur Hinweis "neuer Antrag
  eingegangen" + nicht-sensible Eckdaten).
- Kein eigener Notification-Service (das ist bewusst ein späteres,
  separates Thema) — direkt über die bestehende nodemailer-Infrastruktur in
  `sck-api` (Vorbild: `email-controller.ts`).
- SEPA-Mandatsverarbeitung bleibt manueller Schritt für den Kassenwart
  (offline, wie bisher) — kein automatisierter Bankexport in diesem
  Feature.

### Weitere Änderung
`membership.tile.ts`: `TileActions.Download` → `TileActions.Register`,
`downloadActionLink` (OneDrive-PDF) entfernen. Die Tile muss dann einen
Registrierungs-Weg öffnen (Dialog oder Route — am bestehenden Muster für
Kurs-/Trip-Registrierung orientieren, welches von beidem in
`home.component.ts`/`routing-dialog.component.ts` schon für andere
Tile-Typen existiert, das gleiche Muster für `membership` ergänzen).

## Was zu bauen ist

**Frontend** (`src/web/projects/membership-lib`, aktuell leeres Gerüst):
- `membership-registration-form`-Komponente + Service-Interface (DI-Token,
  wie bei den anderen Registrierungsformularen) + Submit-Flow.
- Dynamisches Hinzufügen weiterer Familienmitglieder (FormArray-Pattern wie
  in `trips-registration-form`).
- Einbindung in `sck-app` (Dialog- oder Routen-Weg, siehe oben) plus
  Anpassung `membership.tile.ts`.

**Backend** (`src/api/sck-api`):
- Neuer Controller/neue Route (Vorbild `registration-controller.ts`),
  validiert Pflichtfelder analog zum bestehenden Muster.
- SEPA-Daten getrennt + feldweise verschlüsselt speichern (s. o.).
- Zwei E-Mails verschicken (Antragsteller + Vorstand/Kassenwart) über die
  bestehende `email-controller.ts`/nodemailer-Infrastruktur bzw. ein neues,
  analog aufgebautes Mail-Template in `projects/data/mail-templates/`.

## Verifikation vor Abschluss

- `bash scripts/verify.sh` (beide Pakete) muss grün sein.
- Formular lässt sich mit und ohne zusätzliche Familienmitglieder absenden.
- Nach Absenden: zwei E-Mails werden ausgelöst (Antragsteller +
  Vorstand/Kassenwart), IBAN taucht in der Vorstands-Mail nicht im Klartext
  auf.
- IBAN ist im gespeicherten Datenbestand nicht im Klartext lesbar
  (verschlüsselt).
- `membership.tile.ts` öffnet jetzt einen Registrierungsweg statt einen
  PDF-Download.
