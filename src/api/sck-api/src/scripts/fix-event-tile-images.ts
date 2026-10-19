/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Einmaliges Korrektur-Tool (siehe Issue #229): die Tile-Migration (#210)
// hat tile.image unveraendert aus den alten statischen Daten uebernommen -
// die meisten Ausfahrten hatten dort relative Pfade
// (../../../../assets/img/cards/X.jpg), gedacht fuer den Asset-Bundler der
// alten sck-app, keine echte URL fuer die Admin-App oder die API.
//
// Vorbedingung: die Zieldateien liegen bereits unter den in FILENAME_MAP
// genannten Namen im Media-Verzeichnis des Containers (siehe
// upload-service.ts's mediaDir), z.B. per `docker cp`.
//
// Ausfuehren (innerhalb des laufenden Containers, __dirname muss auf das
// echte /app/dist zeigen, siehe die Gegenstuecke export-/import-tiles.ts):
// node fix-event-tile-images-bundle.mjs

import { listTiles, updateTile } from '../services/tiles-service.js';
import { TileCreationParams } from '../domain/tile.js';

// basename des alten relativen Pfads -> bereits im Media-Verzeichnis
// abgelegter Ziel-Dateiname (siehe Issue #229 fuer die Herkunft).
const FILENAME_MAP: Record<string, string> = {
  'piste2.jpg': 'piste2.jpg',
  'skiing.jpg': 'skiing.jpg',
  'ski.jpg': 'ski.jpg',
  'skis.jpg': 'skis.jpg',
  'snow.jpg': 'snow.jpg',
  'huette.jpg': 'huette.jpg',
  'snowboarding.jpg': 'snowboarding.jpg',
  'lift.jpg': 'lift.jpg',
};

const { items } = listTiles({ page: 1, limit: 1000 });
let fixed = 0;
let skipped = 0;

for (const tile of items) {
  if (!tile.image || !tile.image.startsWith('../')) continue;

  const basename = tile.image.split('/').pop() ?? '';
  const targetFilename = FILENAME_MAP[basename];
  if (!targetFilename) {
    console.warn(`Kein Ziel-Dateiname fuer "${tile.image}" (Tile "${tile.title}") - uebersprungen.`);
    skipped += 1;
    continue;
  }

  const { id, ...rest } = tile;
  const params = {
    ...rest,
    image: `/media/${targetFilename}`,
    imageId: targetFilename,
  } as TileCreationParams;

  updateTile(id, params);
  console.log(`Aktualisiert: "${tile.title}" -> /media/${targetFilename}`);
  fixed += 1;
}

console.log(`\nFertig: ${fixed} aktualisiert, ${skipped} uebersprungen (kein Ziel-Dateiname).`);
