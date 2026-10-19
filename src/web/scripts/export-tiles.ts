/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Einmaliges Migrations-Tool (siehe Issue #210): liest die bestehenden
// statischen Tile-Konstanten (noch im Angular-Build-Kontext, daher die
// @shared/@data-Pfadaliase) und schreibt sie als einfaches, Angular-freies
// JSON heraus. Ein zweites Script (src/api/sck-api/src/scripts/import-tiles.ts)
// liest diese Datei und legt die Tiles ueber die echte sck-api-Service-Logik
// an (createTile/setTileBoardings) - kein roher SQL-INSERT.
//
// Ausfuehren: npx tsx scripts/export-tiles.ts   (im src/web-Verzeichnis,
// damit tsconfig.json mit den Pfadaliasen automatisch gefunden wird)

// Bewusst relative Importe statt des @data-Barrels (index.ts) - der Barrel
// re-exportiert auch notification-settings-store.ts/mail-template-settings-store.ts,
// die Angular-Services referenzieren und dadurch einen vollen Angular-
// Bootstrap-Kontext brauchen. Direkter Import der einzelnen Daten-Module
// umgeht das zwar fuer den Barrel, aber die Tile-Dateien selbst importieren
// Enums (TileType etc.) aus dem @shared/ui-common-Barrel, der ebenfalls
// Angular-Komponenten re-exportiert ("JIT compilation failed for injectable
// PlatformLocation") - der Compiler-Import unten laedt den noetigen
// JIT-Fallback, ohne eine einzige App-Datei anfassen zu muessen.
import '@angular/compiler';
import { writeFileSync } from 'node:fs';
import { TRIP_DATA } from '../projects/data/trip-data';
import { STATIC_DATA } from '../projects/data/static-data';
import { COURSE_DATA } from '../projects/data/course-data';
import { Tile } from '@shared/ui-common';

const ALL_TILES: Tile[] = [...TRIP_DATA, ...STATIC_DATA, ...COURSE_DATA];

// Felder, die es im API-Datenmodell nicht gibt (reine Client-Berechnungen)
// bzw. die durch den Import ohnehin neu vergeben werden, rausfiltern -
// schadet zwar nicht wenn sie mitkommen (createTile ignoriert unbekannte
// Keys), macht die Export-Datei aber lesbarer.
const STRIP_KEYS = new Set(['id', 'expired', 'confirmedRegistrationsCount', 'imageOnly']);

const normalized = ALL_TILES.map((tile) => {
    const record = tile as unknown as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
        if (STRIP_KEYS.has(key)) continue;
        out[key] = value instanceof Date ? value.toISOString() : value;
    }
    return out;
});

const OUTPUT_PATH = 'tiles-export.json';
writeFileSync(OUTPUT_PATH, JSON.stringify(normalized, null, 2));
console.log(`${normalized.length} Tiles nach ${OUTPUT_PATH} exportiert.`);
