/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile } from 'projects/shared-lib/src/lib/ui-common/models';
import { SCHNEESCHUHVERLEIH_TILE } from './events';

export const BOARDING_LIST = [
    'Westhausen Turnhalle (5:40 Uhr)',
    'Lauchheim Schule (5:50 Uhr)',
    'Hülen (6:00 Uhr)',
    'Ebnater Tennishalle (6:10 Uhr)',
];

export const BOARDING_LIST_SHORT = ['Schwabsberg Schule (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'];

// Die Ausfahrten-Events selbst kommen seit Issue #215 ausschliesslich aus
// der sck-api-DB (siehe trip-tiles-api.service.ts) - hier bleiben nur noch
// der Schneeschuhverleih als Info-Tile, fuer den es noch keine API-Anbindung gibt.
// Termine ohne Anmeldung (z. B. die Skiboerse) sind Events in der API, ohne Aktion
// "register" - siehe tile-card.component.ts (isAppointment).
export const TRIP_DATA: Tile[] = [SCHNEESCHUHVERLEIH_TILE];
