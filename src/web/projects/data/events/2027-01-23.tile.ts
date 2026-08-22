/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Auch in dieser Saison darf unser Klassiker, die Ausfahrt nach Ehrwald, nicht fehlen.
Dieses Gebiet verfügt über wunderschöne, leichte bis mittelschwere Waldpisten.
Besonders Familien finden hier traumhafte Bedingungen vor. Für jeden ist etwas dabei – seien es die breiten Pisten, der Funpark oder die Funslope mit Wellen, Tunneln und Schneeschnecke.

Falls ihr doch lieber die Gegend zu Fuß erkundet, könnt ihr direkt an der Ehrwalder Almbahn loslegen: Von dort aus starten zwei schöne Winterwanderwege und Schneeschuhtrails.

**Ansprechpartner**
- Christian Silfang, Tel: 0157/51765444
- Evelyne Gebler, Tel: 0151/26380686
`;

const BOARDING_LIST = [
    'Westhausen Turnhalle (5:15 Uhr)',
    'Lauchheim Schule (5:25 Uhr)',
    'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)',
];

export const TAGESAUSFAHRT_EHRWALD: EventTile = {
    id: 'tagesausfahrt-ehrwald-2027',
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'TAGESAUSFAHRT NACH EHRWALD',
    date: '23. Januar 2027',
    subTitle: 'Familienfreundlich',
    image: '../../../../assets/img/cards/huette.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    details: '',
    actions: [TileActions.Register],
    expiration: new Date('2027-01-24'),
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
            },
        },
    },
};
