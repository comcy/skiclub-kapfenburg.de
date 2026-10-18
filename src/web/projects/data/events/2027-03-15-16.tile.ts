/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Eine Ausfahrt für alle, die unter der Woche Zeit haben und freie Pisten lieben.
Zusammen mit dem Freizeitclub La-Oele geht es an den Hochzeiger im Pitztal mit Übernachtung im 4* Hotel Arzlerhof mit Hallenbad und tollem Wellnessbereich.

**Ziel**
- Hochzeiger im Pitztal

**Ansprechpartner**
- Tobi Schmid, Tel: 0172/7167288
`;

const BOARDING_LIST = ['Schwabsberg (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'];

export const FREIE_PISTENAUSFAHRT: EventTile = {
    id: 'freie-pistenausfahrt-2027',
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: '2-TAGES „FREIE PISTEN" AUSFAHRT MIT DEM FREIZEITCLUB LA-OELE',
    date: '15. bis 16. März 2027',
    destination: 'Hochzeiger im Pitztal',
    subTitle: 'Ab 18 Jahren',
    image: '../../../../assets/img/cards/ski.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    details: '',
    actions: [TileActions.Register],
    expiration: new Date('2027-03-16'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
    additionalInformation:
        'Im Preis enthalten ist die Busfahrt mit Vesper, 2-Tages-Skipass und eine Übernachtung inklusive Halbpension',
    tripConfig: {
        pricing: {
            busLift: {
                adult: {
                    member: 275,
                    nonMember: 275,
                },
                youthUntil16: {
                    member: 275,
                    nonMember: 275,
                },
                childUntil6: {
                    member: 275,
                    nonMember: 275,
                },
            },

            addons: {},
        },
    },
};
