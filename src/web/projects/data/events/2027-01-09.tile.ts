/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Diese Ausfahrt eignet sich sowohl für reine Anfänger als auch für Fortgeschrittene. Egal ob ihr das erste Mal auf Skiern oder dem Board steht oder einfach eure Technik verbessern wollt – hier seid ihr richtig!

Unser erfahrenes Lehrteam trainiert mit euch auf der Piste und bei Bedarf gerne im Funpark.

In dieser Saison lassen wir uns das Skigebiet bis zuletzt offen. Je nach Wetter- und Schneelage suchen wir spontan das perfekte Skigebiet im Allgäu für uns aus.

**Ansprechpartner**
- Johannes Müller, Tel: 0176/70888590
- Nicole Zimmermann, Tel: 0176/82455480
`;

const BOARDING_LIST = [
    'Westhausen Turnhalle (5:15 Uhr)',
    'Lauchheim Schule (5:25 Uhr)',
    'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)',
];

export const TRAININGSTAG_ALLGAEU_TILE: EventTile = {
    id: 'trainingstag-allgaeu-2027',
    order: 4,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'TRAININGSTAG INS ALLGÄU',
    date: '09. Januar 2027',
    destination: 'Allgäu (je nach Schneelage)',
    subTitle: '',
    image: '../../../../assets/img/cards/piste2.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    details: '',
    actions: [TileActions.Register],
    expiration: new Date('2027-01-09'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
    additionalInformation: 'Kurse ab 5 Jahre möglich',
    tripConfig: {
        pricing: {
            busLift: {
                adult: {
                    member: 75,
                    nonMember: 85,
                },
                youthUntil16: {
                    member: 65,
                    nonMember: 75,
                },
                childUntil6: {
                    member: 50,
                    nonMember: 55,
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
                courseBeginner: {
                    member: 35,
                    nonMember: 40,
                },
            },
        },
    },
};
