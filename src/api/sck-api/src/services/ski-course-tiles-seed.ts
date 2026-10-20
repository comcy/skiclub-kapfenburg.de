/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { db } from '../db/connection.js';
import { TileActions, TileBehavior, TileStatus, TileType } from '../domain/tile.js';
import { getSetting, setSetting } from './settings-service.js';
import { createTile } from './tiles-service.js';

const SEEDED_SETTING_KEY = 'ski-course-tiles-seeded';

// Die vier Koennerstufen der oeffentlichen Kurse-Seite (sck-app, siehe
// COURSE_LEVEL_TILES). Der Titel ist bewusst nur das Kuerzel: die sck-app
// ordnet den statischen Beschreibungstext ueber genau diesen Titel zu
// (courses.component.ts, STATIC_LEVEL_BY_TITLE_CODE). Beschreibung etc. bleiben
// leer und fallen auf den statischen Text zurueck, bis der Admin sie ueberschreibt.
const LEVEL_CODES = ['A1', 'A2', 'F1', 'F2'];

// Ohne ein echtes Ski-Kurs-Tile gibt es keine tileId - die Kursanmeldung
// landet dann nur im Google Sheet, nicht in course_registrations, und die
// Bestaetigungsmail kommt nicht von der API. Einmalig angelegt (Marker in den
// Settings), damit ein vom Admin bewusst geloeschtes Tile nicht bei jedem
// Neustart wieder auftaucht. Ski-Kurs-Tile = type 'course' ohne
// verschachteltes `course` (das ist Pilates), siehe CourseTileListComponent.
export const seedSkiCourseTilesOnce = (): number => {
  if (getSetting<boolean>(SEEDED_SETTING_KEY)) return 0;

  const existing = db
    .prepare(`SELECT 1 FROM tiles WHERE type = 'course' AND (extra_json IS NULL OR extra_json NOT LIKE '%"course":%') LIMIT 1`)
    .get();
  if (!existing) {
    LEVEL_CODES.forEach((code, index) =>
      createTile({
        order: index + 1,
        type: TileType.Course,
        title: code,
        date: '',
        subTitle: '',
        image: '',
        imageDescription: '',
        description: '',
        status: TileStatus.Open,
        expiration: '2099-12-31T00:00:00.000Z',
        behavior: TileBehavior.View,
        actions: [TileActions.Register],
        visible: true,
      }),
    );
  }
  setSetting(SEEDED_SETTING_KEY, true);
  return existing ? 0 : LEVEL_CODES.length;
};
