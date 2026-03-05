/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';
import { DEFAULT_TRIP_OPTIONS } from 'projects/shared-lib/src/lib/models/trip-options';

const DESCRIPTION_TEXT = `Bei unser diesjährigen Kooperationsausfahrt mit dem Freizeitclub La-Oele geht es wieder nach Vorarlberg ins Skigebiet Golm mit Übernachtung im Hotel „Weisses Kreuz“ in Feldkirch.

**Ziel**
 - Brandnertal

**Abfahrtszeiten**
 - 05:00 Uhr Schwabsberg Schule 
 - 05:15 Uhr Westhausen Turnhalle

**Kosten**

|                             |              |
|:----------------------------|-------------:|
|  Erwachsene                 |   245,00 €*  |
|  Jugendliche bis 16 Jahre   |   180,00 €*  | 
|  Kinder bis 6 Jahre         |   85,00 €*   |

--- 

**Im Preis enthalten ist die Busfahrt mit Vesper, 2-Tages-Skipass und eine Überachtung inklusive Halbpension*

`;

const BOARDING_LIST = ['Schwabsberg (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'];

export const LA_OELE_AUSFAHRT: EventTile = {
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'LA OELE 2-TAGES SKIAUSFAHRT INS BRANDNERTAL',
    date: '17. bis 18. Januar 2026',
    subTitle: '',
    image: '../../../../assets/img/cards/snowboarding.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2026-01-18'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
    tripConfig: {
        pricing: {
            busLift: {
                adult: {
                    member: 245,
                    nonMember: 245,
                },
                youthUntil16: {
                    member: 180,
                    nonMember: 180,
                },
                childUntil6: {
                    member: 85,
                    nonMember: 85,
                },
            },

            busOnly: {
                member: 0,
                nonMember: 0,
            },

            addons: {},
        },
        options: {
            ...DEFAULT_TRIP_OPTIONS,
            allowBusOnly: false,
            allowSnowshoes: false,
            allowTechnikTraining: false,
        },
    },
};
