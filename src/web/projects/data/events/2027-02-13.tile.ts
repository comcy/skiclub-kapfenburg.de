/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Kommt mit uns in die Tiroler Zugspitz-Arena nach Lermoos. Im Skigebiet Grubigstein steht auf 1000 - 2100m Höhe wintersportlicher Spaß auf dem Programm. Zwölf 
Abfahrten bringen Abwechslung. Auch für das leibliche Wohl ist gesorgt: Zahlreiche 
Hütten bieten Gelegenheit zum Einkehrschwung. 
Den Schneetag lassen wir ausklingen beim Aprés Ski in der „Lahmen Ente“ direkt 
an der Talstation. Hierfür ist genügend Zeit eingeplant, denn es geht erst um 19 Uhr 
zurück Richtung Heimat.

**Rückfahrt**
- 19:00 Uhr
`;

const BOARDING_LIST = [
    'Schwabsberg Schule (5:00 Uhr)',
    'Westhausen Turnhalle (5:15 Uhr)',
    'Lauchheim Schule (5:25 Uhr)',
    'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)',
];

export const PARTYAUSFAHRT_LERMOOS: EventTile = {
    id: 'partyausfahrt-lermoos-2026',
    order: 6,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'PARTYAUSFAHRT NACH LERMOOS',
    date: '21. Februar 2026',
    subTitle: 'Ausfahrt ab 18 Jahre',
    image: '../../../../assets/img/cards/lift.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    details: '',
    actions: [TileActions.Register],
    expiration: new Date('2026-02-22'),
    boardings: BOARDING_LIST,
    status: TileStatus.BookedUp,
    tripConfig: {
        pricing: {
            busLift: {
                adult: {
                    member: 95,
                    nonMember: 95,
                },
                youthUntil16: {
                    member: 95,
                    nonMember: 95,
                },
                childUntil6: {
                    member: 95,
                    nonMember: 95,
                },
            },

            addons: {
                snowshoes: {
                    member: 5,
                    nonMember: 5,
                },
            },
        },
    },
};
