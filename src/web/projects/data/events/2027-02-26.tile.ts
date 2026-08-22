/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Wie könnte das Wochenende besser beginnen als mit Skifahren/Snowboarden?
Getreu nach diesem Motto fahren wir am Freitag zur Ehrwalder Almbahn und genießen die tolle Landschaft mit leeren Pisten.
Zum Abschluss lassen wir den Tag beim Après Ski in der Brent Alm an der Talstation ausklingen.

**Rückfahrt**
- 18:00 bis 18:30 Uhr

**Ansprechpartner**
- Hans Sachs, Tel: 0171/2721889
- Jürgen Robitschko, Tel: 0171/6539018
`;

const BOARDING_LIST = [
    'Westhausen Turnhalle (5:15 Uhr)',
    'Lauchheim Schule (5:25 Uhr)',
    'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)',
    'Ebnat Jurahalle (5:40 Uhr)',
];

export const FREITAGSAUSFAHRT_EHRWALD: EventTile = {
    id: 'freitagsausfahrt-ehrwald-2027',
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'FREITAGSAUSFAHRT NACH EHRWALD',
    date: '26. Februar 2027',
    subTitle: '',
    image: '../../../../assets/img/cards/skis.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    details: '',
    actions: [TileActions.Register],
    expiration: new Date('2027-02-27'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
    tripConfig: {
        pricing: {
            busLift: {
                adult: {
                    member: 85,
                    nonMember: 95,
                },
                youthUntil16: {
                    member: 85,
                    nonMember: 95,
                },
                childUntil6: {
                    member: 85,
                    nonMember: 95,
                },
            },

            busOnly: {
                member: 30,
                nonMember: 30,
            },

            addons: {
                snowshoes: {
                    member: 8,
                    nonMember: 8,
                },
            },
        },
    },
};
