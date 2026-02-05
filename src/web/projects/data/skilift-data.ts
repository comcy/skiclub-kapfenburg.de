/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import {
    LoipenSnowStatus,
    LoipenState,
    SkiliftOpeningHours,
    SkiliftPrices,
    SkiliftSnowStatus,
    SkiliftState,
} from 'projects/skilift-lib/src/lib/skilift-info/skilift-info.interfaces';

export const LOIPEN_STATUS: LoipenSnowStatus = {
    state: LoipenState.OPEN, // OPEN | CLOSED
    text: 'Loipen sind gespurt',
    lastUpdate: '02. Februar 2026',
};

export const SKILIFT_STATUS: SkiliftSnowStatus = {
    state: SkiliftState.CLOSED, // OPEN | CLOSED
    text: 'Skilift NICHT in Betrieb',
    lastUpdate: '05. Februar 2026',
};

export const SKILIFT_OPENING_HOURS: SkiliftOpeningHours[] = [{ day: 'ab 05. Februar 2026', time: 'geschlossen' }];

export const SKILIFT_CONDITIONS: string[] = [
    'Betrieb nur bei ausreichender Schneelage',
    'Bei Bedarf wird Flutlicht eingeschaltet',
];

export const SKILIFT_PRICES: SkiliftPrices[] = [
    { label: '10er-Karte Erwachsene', price: '8 €' },
    { label: '10er-Karte Kinder', price: '6 €' },
];
