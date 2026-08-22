/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Bei unserer diesjährigen Kooperationsausfahrt mit dem Freizeitclub La-Oele lassen wir uns das Ziel offen.

Übernachtung „Hoteljoker" in Feldkirch.

**Ziel**
- Brand, Golm oder Sonnenkopf (je nach Schneelage)

**Ansprechpartner**
- Tobi Schmid, Tel: 0172/7167288
`;

const BOARDING_LIST = ['Schwabsberg (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'];

export const LA_OELE_AUSFAHRT: EventTile = {
    id: 'la-oele-ausfahrt-2027',
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: '2-TAGES SKIAUSFAHRT, BRAND, GOLM ODER SONNENKOPF MIT LA-OELE',
    date: '16. bis 17. Januar 2027',
    destination: 'Skigebiet nach Schneelage',
    subTitle: '',
    image: '../../../../assets/img/cards/snowboarding.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    details: '',
    actions: [TileActions.Register],
    expiration: new Date('2027-01-17'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
    additionalInformation:
        'Im Preis enthalten ist die Busfahrt mit Vesper, 2-Tages-Skipass und eine Überachtung inklusive Halbpension',
    tripConfig: {
        pricing: {
            busLift: {
                adult: {
                    member: 250,
                    nonMember: 250,
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

            addons: {},
        },
    },
};
