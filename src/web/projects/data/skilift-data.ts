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
    state: SkiliftState.OPEN, // good | limited | closed
    text: 'Skilift in Betrieb',
    lastUpdate: '6. Januar 2026 (im Falle von Fragen, nehmt gerne mit uns Kontakt auf.) ',
};

export const SKILIFT_OPENING_HOURS: SkiliftOpeningHours[] = [
    { day: '4. Januar 2026', time: 'ab 10:00 Uhr' },
    { day: '5. Januar 2026', time: 'ab 10:00 Uhr' },
    { day: '6. Januar 2026', time: 'ab 10:00 Uhr' },
    { day: 'ab 7. Januar 2026', time: 'ab 15:30 Uhr' },
];

export const SKILIFT_CONDITIONS: string[] = [
    'Betrieb nur bei ausreichender Schneelage',
    'Bei Bedarf wird Flutlicht eingeschaltet',
];

export const SKILIFT_PRICES: SkiliftPrices[] = [
    { label: '10er-Karte Erwachsene', price: '8 €' },
    { label: '10er-Karte Kinder', price: '6 €' },
];
