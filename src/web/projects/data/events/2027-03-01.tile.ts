/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `An unserer Montagsausfahrt geht es traditionell nach Oberstdorf zum Skigebiet Fellhorn/Kanzelwand. Hier erwartet euch ein abwechslungsreiches Skigebiet mit 36 bestens präparierten Pisten für jedes Level.
Das Gebiet verfügt über eine der modernsten Beschneiungsanlagen in Deutschland, womit dem Schneevergnügen nichts mehr im Wege steht.

Nach einem tollen Schneetag lassen wir den Tag mit Kaffee und Kuchen am Bus oder an der Aprés Ski Bar ausklingen.

**Ansprechpartner**
- Jürgen Robitschko, Tel: 0171/6539018
- Roland Eichberger, Tel: 0170/4312150
`;

const BOARDING_LIST = [
    'Westhausen Turnhalle (5:15 Uhr)',
    'Lauchheim Schule (5:25 Uhr)',
    'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)',
];

export const MONTAGSAUSFAHRT_FELLHORN: EventTile = {
    id: 'montagsausfahrt-fellhorn-2027',
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'MONTAGSAUSFAHRT ANS FELLHORN',
    date: '01. März 2027',
    subTitle: '',
    image: '../../../../assets/img/cards/skiing.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    details: '',
    actions: [TileActions.Register],
    expiration: new Date('2027-03-02'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
    destination: 'Skigebiet Fellhorn (Oberstdorf)',
    tripConfig: {
        pricing: {
            busLift: {
                adult: {
                    member: 80,
                    nonMember: 90,
                },
                youthUntil16: {
                    member: 70,
                    nonMember: 80,
                },
                childUntil6: {
                    member: 55,
                    nonMember: 60,
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
