/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { EventTile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';
import { DEFAULT_TRIP_OPTIONS } from 'projects/trips-lib/src/lib/domain/models/trip-options';

const DESCRIPTION_TEXT = `Gemeinsam mit euch wollen wir die Pisten auf über 2000m Höhe unsicher machen. 
Es gibt hier familienfreundliche Abfahrten bei tollem Panorama, aber auch herausfordernde, steile Pisten wie die „Bäraloch-Piste“. 

Das Skigebiet Sonnenkopf liegt am Fuße des Arlbergs und gilt als sehr schneesicher. 
Ihr könnt euch daher auf den Pisten austoben oder auch unsere Schneeschuhe für eine tolle Wanderung ausleihen. 

Nach einem erfolgreichen Schneetag lassen wir den Tag in der „KELO-Bar“ ausklingen und stoßen dort miteinander an

**Abfahrtszeiten**
- 05:00 Uhr Schwabsberg
- 05:15 Uhr Westhausen Turnhalle

**Rückfahrt**
- 19:00 Uhr

**Kosten**
- Bus + Liftkarte + kl. Vesper: 100,00 €
- Schneeschuhverleih: 5,00 €
`;

const BOARDING_LIST = ['Schwabsberg Schule (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'];

export const PARTYAUSFAHRT_SONNENKOPF_TILE: EventTile = {
    order: 3,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'PARTYAUSFAHRT AN DEN SONNENKOPF',
    date: '28. Dezember 2025',
    subTitle: 'Ausfahrt ab 18 Jahre',
    image: 'https://cdn.pixabay.com/photo/2014/10/22/18/04/man-498473_960_720.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2025-12-28'),
    boardings: BOARDING_LIST,
    status: TileStatus.BookedUp,
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

            busOnly: {
                member: 0,
                nonMember: 0,
            },

            addons: {
                snowshoes: {
                    member: 5,
                    nonMember: 5,
                },
            },
        },
        options: {
            ...DEFAULT_TRIP_OPTIONS,
            allowBusOnly: false,
            allowSnowshoes: true,
            allowTechnikTraining: false,
        },
    },
};
