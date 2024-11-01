/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Diese Saison haben wir eine weitere Partyausfahrt im Programm! 

Gemeinsam mit euch wollen wir die Pisten auf über 2000m Höhe unsicher machen.
Das Skigebiet Sonnenkopf liegt am Fuße des Arlbergs und gilt als sehr schneesicher. Ihr könnt euch daher auf den Pisten austoben oder auch unsere Schneeschuhe für eine tolle Wanderung ausleihen.

Nach einem erfolgreichen Schneetag lassen wir den Tag in der *„KELO-Bar“* ausklingen und stoßen dort miteinander auf die tolle Zeit an.

**Abfahrtszeiten**
- 05:00 Uhr Schwabsberg
- 05:15 Uhr Westhausen Turnhalle

**Rückfahrt**
- 19:00 Uhr

**Kosten**
- Bus + Liftkarte + kl. Vesper: 89,00 €
- Schneeschuhverleih: 5,00 €
`;

const BOARDING_LIST = ['Schwabsberg Schule (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'];

export const PARTYAUSFAHRT_SONNENKOPF_TILE: Tile = {
    order: 3,
    behavior: TileBehavior.View,
    title: 'PARTYAUSFAHRT AN DEN SONNENKOPF',
    date: '28. Dezember 2023',
    subTitle: 'Ausfahrt ab 18 Jahre',
    image: 'https://cdn.pixabay.com/photo/2014/10/22/18/04/man-498473_960_720.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2023-12-28'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
};
