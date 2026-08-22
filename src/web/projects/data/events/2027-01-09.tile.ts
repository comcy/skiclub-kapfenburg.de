/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Diese Ausfahrt eignet sich sowohl für reine Anfänger als auch für Fortgeschrittene. 
Egal ob ihr das erste Mal auf Skiern oder dem Board steht oder einfach eure Technik 
verbessern wollt – hier seid ihr richtig! 
Unser erfahrenes Lehrteam trainiert mit euch auf der Piste und bei Bedarf gerne im 
Funpark.
In dieser Saison fahrne wir mit euch in das „familienfreundlichste Skigebiet in den 
Alpen“. Dort gibt es über 30km traumhafte Pisten auf fast 1600m Höhe. Für alle, die 
sich im Funpark austoben möchten, bietet der „Easypark“ die perfekte Gelegenheit 
dazu. Bei guter Schneelage ist eine Langlaufloipe vorhanden.

`;

const BOARDING_LIST = [
    'Westhausen Turnhalle (5:15 Uhr)',
    'Lauchheim Schule (5:25 Uhr)',
    'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)',
];

export const TRAININGSTAG_OBERJOCH_TILE: EventTile = {
    id: 'trainingstag-oberjoch-2026',
    order: 4,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'TRAININGSTAG IN OBERJOCH',
    date: '10. Januar 2026',
    subTitle: '',
    image: '../../../../assets/img/cards/piste2.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    details: '',
    actions: [TileActions.Register],
    expiration: new Date('2026-01-11'),
    boardings: BOARDING_LIST,
    status: TileStatus.BookedUp,
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
                    member: 5,
                    nonMember: 5,
                },

                technikHalf: {
                    member: 35,
                    nonMember: 30,
                },

                technikFull: {
                    member: 60,
                    nonMember: 55,
                },
                courseBeginner: {
                    member: 35,
                    nonMember: 40,
                },
            },
        },
    },
};
