/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import {
    SkiliftOpeningHours,
    SkiliftPrices,
    SkiliftSnowStatus,
    SkiliftState,
} from 'projects/skilift-lib/src/lib/skilift-info/skilift-info.interfaces';

export const SKILIFT_STATUS: SkiliftSnowStatus = {
    state: SkiliftState.CLOSED, // OPEN | CLOSED
    text: 'Skilift in Betrieb',
    lastUpdate: '7. Januar 2026 (im Falle von Fragen, nehmt gerne mit uns Kontakt auf.) ',
};

export const SKILIFT_OPENING_HOURS: SkiliftOpeningHours[] = [
    { day: 'am 8. Januar 2026', time: 'ab 15:00 Uhr' },
    { day: 'am 9. Januar 2026', time: 'geschlossen, zu wenig Schnee' },
    { day: 'am 10. Januar 2026', time: 'geplant ab 10:00 Uhr' },
    { day: 'am 11. Januar 2026', time: 'geplant ab 10:00 Uhr' },
];

export const SKILIFT_CONDITIONS: string[] = [
    'Betrieb nur bei ausreichender Schneelage',
    'Bei Bedarf wird Flutlicht eingeschaltet',
];

export const SKILIFT_PRICES: SkiliftPrices[] = [
    { label: '10er-Karte Erwachsene', price: '8 €' },
    { label: '10er-Karte Kinder', price: '6 €' },
];
