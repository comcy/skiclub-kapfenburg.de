/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `An unserer Montagsausfahrt geht es traditionell nach Oberstdorf zum Skigebiet Fellhorn/Kanzelwand. Hier erwartet euch ein abwechslungsreiches Skigebiet mit 36 bestens präparierten Pisten für jedes Level. 
Das Gebiet verfügt über eine der modernsten Beschneiungsanlagen in Deutschland, womit dem Schneevergnügen nichts mehr im Wege steht. 

Nach einem tollen Schneetag lassen wir den Tag mit Kaffee und Kuchen am Bus oder an der Aprés Ski Bar ausklingen.

_Hinweis: Keine Anfänger_
`;

const BOARDING_LIST = [
    'Westhausen Turnhalle (5:15 Uhr)',
    'Lauchheim Schule (5:25 Uhr)',
    'Hülen Bushaltestelle (5:30 Uhr)',
];

export const MONTAGSAUSFAHRT_FELLHORN: EventTile = {
    id: 'montagsausfahrt-fellhorn-2026',
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'MONTAGSAUSFAHRT FELLHORN',
    date: '09. März 2026',
    subTitle: '',
    image: '../../../../assets/img/cards/skiing.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2026-03-10'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
    destination: 'Skigebiet Fellhorn (Oberstdorf)',
    additionalInformation:
        'Im Preis enthalten ist die Busfahrt mit Vesper, 2-Tages-Skipass und eine Überachtung inklusive Halbpension',
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
                    member: 5,
                    nonMember: 5,
                },
                technikHalf: {
                    member: 35,
                    nonMember: 40,
                },
                technikFull: {
                    member: 60,
                    nonMember: 65,
                },
                courseAdvanced: {
                    member: 25,
                    nonMember: 30,
                },
                courseBeginner: {
                    member: 25,
                    nonMember: 30,
                },
            },
        },
    },
};
