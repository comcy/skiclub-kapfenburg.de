/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Einmaliges Migrations-Tool (siehe Issue #210), Gegenstueck zu
// src/web/scripts/export-tiles.ts. Liest die dort erzeugte tiles-export.json
// und legt jeden Eintrag ueber die echte sck-api-Service-Logik an
// (createTile/setTileBoardings) - kein roher SQL-INSERT, damit Validierung/
// Konsistenz (extra_json-Whitelist, Boardings-Verknuepfung) exakt wie bei
// einer normalen Admin-Erstellung laeuft.
//
// Idempotent: ueberspringt Eintraege, fuer die schon ein Tile mit
// identischem title+date existiert (verhindert Duplikate bei mehrfachem
// Ausfuehren, z.B. aus Versehen oder nach einem Teilfehlschlag).
//
// Ausfuehren: npx tsx src/scripts/import-tiles.ts <pfad-zu-tiles-export.json>
// (im src/api/sck-api-Verzeichnis, braucht Zugriff auf die echte .env fuer
// den DB-Pfad, siehe db/connection.ts)

import { readFileSync } from 'node:fs';
import { db } from '../db/connection.js';
import { createTile } from '../services/tiles-service.js';
import { createBoarding } from '../services/boardings-service.js';
import { Tile, TileCreationParams } from '../domain/tile.js';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: tsx src/scripts/import-tiles.ts <tiles-export.json>');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(inputPath, 'utf-8')) as Record<string, unknown>[];

// setTileBoardings() (von createTile() aufgerufen) ignoriert Namen, die nicht
// im boardings-Katalog existieren (bewusst, siehe tiles-service.ts) - die
// Legacy-Haltestellen aus den statischen Daten muessen deshalb hier vorab
// angelegt werden, sonst gehen sie beim Import stillschweigend verloren.
const ensureBoardingsExist = (names: string[]): void => {
  for (const name of new Set(names.filter((n) => n && n.trim().length > 0))) {
    const existing = db.prepare('SELECT id FROM boardings WHERE name = ?').get(name) as { id: string } | undefined;
    if (!existing) {
      createBoarding({ name });
      console.log(`Boarding-Katalog ergaenzt: "${name}"`);
    }
  }
};

let created = 0;
let skipped = 0;

for (const entry of raw) {
  const title = String(entry.title ?? '');
  const date = String(entry.date ?? '');

  const existing = db
    .prepare('SELECT id FROM tiles WHERE title = ? AND date = ?')
    .get(title, date) as { id: string } | undefined;

  if (existing) {
    console.log(`Übersprungen (existiert bereits): "${title}" (${date})`);
    skipped += 1;
    continue;
  }

  const params = entry as unknown as TileCreationParams;
  ensureBoardingsExist(params.boardings ?? []);
  const tile: Tile = createTile(params);
  console.log(`Angelegt: "${tile.title}" (${tile.date}) -> id ${tile.id}`);
  created += 1;
}

console.log(`\nFertig: ${created} angelegt, ${skipped} übersprungen (bereits vorhanden).`);
