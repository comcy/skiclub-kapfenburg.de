/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile } from 'projects/shared-lib/src/lib/ui-common/models';
import {
    FREIE_PISTENAUSFAHRT,
    FREITAGSAUSFAHRT_EHRWALD,
    LA_OELE_AUSFAHRT,
    MONTAGSAUSFAHRT_FELLHORN,
    PARTYAUSFAHRT_LERMOOS,
    PARTYAUSFAHRT_SONNENKOPF_TILE,
    TAGESAUSFAHRT_EHRWALD,
    TAGESAUSFAHRT_MELLAU_DAMUELS,
    TRAININGSTAG_OBERJOCH_TILE,
} from './events';

export const BOARDING_LIST = [
    'Westhausen Turnhalle (5:40 Uhr)',
    'Lauchheim Schule (5:50 Uhr)',
    'Hülen (6:00 Uhr)',
    'Ebnater Tennishalle (6:10 Uhr)',
];

export const BOARDING_LIST_SHORT = ['Schwabsberg Schule (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'];

export const TRIP_DATA: Tile[] = [
    MONTAGSAUSFAHRT_FELLHORN,
    FREIE_PISTENAUSFAHRT,
    FREITAGSAUSFAHRT_EHRWALD,
    TAGESAUSFAHRT_MELLAU_DAMUELS,
    PARTYAUSFAHRT_LERMOOS,
    TAGESAUSFAHRT_EHRWALD,
    LA_OELE_AUSFAHRT,
    TRAININGSTAG_OBERJOCH_TILE,
    PARTYAUSFAHRT_SONNENKOPF_TILE,
];
