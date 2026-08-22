/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Nach der grandiosen Stimmung im letzten Jahr steht fest: Unsere Partyausfahrt steuert wieder die Ehrwalder Alm mit der Brent-Alm an.

Nach einem genialen Skitag auf der Piste verlagern wir das Geschehen direkt an die Talstation, um den Apres-Skidort so richtig zu rocken.

**Rückfahrt**
- 19:00 Uhr

**Ansprechpartner**
- Marius Weber, Tel: 0151/18110710
- Christoph Sachs, Tel: 0152/36442806
`;

const BOARDING_LIST = [
    'Schwabsberg (5:00 Uhr)',
    'Westhausen Turnhalle (5:15 Uhr)',
    'Lauchheim Schule (5:25 Uhr)',
    'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)',
];

export const PARTY_BRENT_ALM_TILE: EventTile = {
    id: 'party-brent-alm-2026',
    order: 3,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: '„AUFS ALTE JAHR" IN DER BRENT-ALM',
    date: '28. Dezember 2026',
    destination: 'Ehrwalder Alm',
    subTitle: 'Ausfahrt ab 18 Jahre',
    image: 'https://cdn.pixabay.com/photo/2014/10/22/18/04/man-498473_960_720.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    details: '',
    actions: [TileActions.Register],
    expiration: new Date('2026-12-28'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
    additionalInformation: 'Im Preis enthalten ist die Busfahrt mit Liftkarte und kleinem Vesper.',
    tripConfig: {
        pricing: {
            busLift: {
                adult: {
                    member: 100,
                    nonMember: 100,
                },
                youthUntil16: {
                    member: 100,
                    nonMember: 100,
                },
                childUntil6: {
                    member: 100,
                    nonMember: 100,
                },
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
