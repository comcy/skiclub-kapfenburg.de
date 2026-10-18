# Arbeitskonventionen — skiclub-kapfenburg.de

Diese Regeln sind aus echten Nacharbeits-Runden entstanden (Preismanagement/Mailtexte-Layoutbugs, SEPA-Export). Sie gelten für jede neue oder geänderte Admin-UI-Seite.

## Reales Nutzungsbild (beeinflusst jedes UI-Design)

- Admin-Eingabefelder für Inhalte (Mailtexte, Beschreibungen, ...) bekommen oft lange, aus bestehenden Dateien kopierte HTML-Blöcke, keine kurzen Strings. Felder müssen von Anfang an großzügig/mitwachsend ausgelegt sein, nicht auf kurze Platzhaltertexte geschätzt.
- Die Admin-Oberfläche wird auch auf schmalen Fenstern/mobil genutzt. Jede neue Admin-Seite bekommt von Anfang an einen Mobile-Breakpoint (gestapeltes statt nebeneinander liegendes Layout), nicht erst nachträglich.

## Neue Seite unter der tile-management-Shell (`settings`, `member-management`, ...)

Diese Shell **clippt statt scrollt** (`overflow: hidden` by design, siehe `tile-management.component.scss`). Jede routed Komponente braucht zwei Teile:

1. **Im eigenen `.component.scss`** (kann NICHT ausgelagert werden — ein Kind-Component-`:host` kann nicht die Höhe seines eigenen Parents binden, das war ein echter Bug in einem ersten Refactoring-Versuch):
   ```scss
   :host {
       display: flex;
       flex-direction: column;
       flex: 1;
       min-height: 0;
       overflow: hidden;
   }
   ```
2. **Im Template** die Kind-Inhalte in `<app-panel-shell>` wrappen (`shared/components/panel-shell/panel-shell.component.ts`) statt `.content-area`/`.content-inner` erneut von Hand zu bauen — übernimmt Scroll + volle Breite:
   ```html
   <app-panel-shell [maxWidth]="'600px'"> <!-- maxWidth weglassen = volle Breite -->
       ...
   </app-panel-shell>
   ```

Referenz: `price-management.component.ts/scss`, `mail-template-management.component.ts/scss`, `fee-collection.component.ts/scss`. Textareas: `cdkTextareaAutosize` statt fixer `rows`, damit nie intern gescrollt werden muss (siehe `mail-template-management.component.ts`).

## Vor "fertig": visueller Check, nicht nur Daten-Check

Ein Test, der nur beweist "Daten kommen korrekt an", übersieht Layout-Bugs. Vor dem Ship jeder UI-Änderung:

- bei realer Fenstergröße rendern, bis zum Seitenende scrollen (Screenshot am unteren Rand)
- Mobile-Breite (~390px) prüfen
- Editoren mit langem/realistischem statt kurzem Platzhaltertext befüllen

`scripts/dev-login.sh` startet API + sck-admin-app (falls nicht schon
laufend) und gibt eine Login-URL (Standard) oder per `--session` einen
Bearer-Token für curl aus — senkt die Hürde für den Check, damit er
Standard bleibt statt übersprungen zu werden. `--stop` beendet beide
Server. Ein Magic-Link-Token ist Single-Use: URL-Modus und `--session`
liefern deshalb nie denselben Token.

## Bestehendes Muster kopieren heißt nicht: Muster ist korrekt

Ein Layout-/Scroll-Bug in einer Komponente wird beim Bauen einer Schwester-Komponente sonst unbemerkt mitkopiert (Preismanagement → Mailtexte hatten denselben Scroll-Bug). Bei Layout/Scroll/Responsive kurz selbst gegenchecken statt blind zu übernehmen, auch wenn es "schon so im Code steht".

## Editor-UI: den leeren Zustand mitdenken

Ein Editor für bereits existierenden Inhalt zeigt beim ersten Öffnen den aktuell live wirksamen Wert, nie ein leeres Feld — sichtbar machen, was gerade bearbeitet wird, bevor zum ersten Mal gespeichert wird (siehe `DEFAULT_*_HTML`-Fallback-Prefill in `mail-template-management.component.ts`).

## Geld-/sicherheitsrelevante Features: kompletter Klick-Durchlauf vor dem Ship

Bei Features, die echtes Geld bewegen oder irreversibel sind (SEPA-Export, Zahlungen, Mitgliederdaten-Löschung, ...): jede Bedienung der UI einmal wirklich anklicken/ausfüllen, inkl. Rand-Widgets wie Datepicker — Provider-Fehler und Locale-Parsing-Bugs (z.B. `01.11.2026` als 11. Januar statt 1. November geparst) zeigen sich nur im echten Rendering, nie in einem reinen API-Test.
