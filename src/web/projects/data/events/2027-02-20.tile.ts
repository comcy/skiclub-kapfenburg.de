/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Bei dieser Ausfahrt geht es in das Traumskigebiet Mellau-Damüls. Dieses befindet sich mitten im Bregenzerwald und ist das größte Gebiet in der Region.
Es bietet über 100 km schneesichere Pisten.

Neben den vielen Pisten von leicht bis sehr anspruchsvoll kommen die Genussfahrer, Schneekids, Freestyler und Freerider voll auf ihre Kosten.
Tobt euch aus auf den bestens präparierten Pisten, im Snowpark, auf der Speed-Strecke, im Skitunnel oder auf der Skiroute.

Auch für Anfänger ist diese Ausfahrt bestens geeignet: Ihr müsst nicht am Übungslift an der Talstation bleiben, denn im Mellauer Teil des Gebietes gibt es viele einfachere Pisten, die gut zu bewältigen sind.

**Ansprechpartner**
- Manuel Abele, Tel: 0152/51467970
- Markus Rup, Tel: 0151/56625746
`;

const BOARDING_LIST = [
    'Westhausen Turnhalle (5:15 Uhr)',
    'Lauchheim Schule (5:25 Uhr)',
    'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)',
];

export const TAGESAUSFAHRT_MELLAU_DAMUELS: EventTile = {
    id: 'tagesausfahrt-mellau-damuels-2027',
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'AUSFAHRT NACH MELLAU-DAMÜLS',
    date: '20. Februar 2027',
    subTitle: '',
    image: '../../../../assets/img/cards/snow.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    details: '',
    actions: [TileActions.Register],
    expiration: new Date('2027-02-21'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
    tripConfig: {
        pricing: {
            busLift: {
                adult: {
                    member: 90,
                    nonMember: 100,
                },
                youthUntil16: {
                    member: 80,
                    nonMember: 90,
                },
                childUntil6: {
                    member: 65,
                    nonMember: 70,
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

                technikHalf: {
                    member: 35,
                    nonMember: 40,
                },

                technikFull: {
                    member: 60,
                    nonMember: 65,
                },
            },
        },
    },
};
