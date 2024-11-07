/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Wie könnte das Wochenende besser beginnen als mit Skifahren/Snowboarden? 
Getreu nach diesem Motto fahren wir am Freitag zur Ehrwalder Almbahn und genießen die tolle Landschaft mit leeren Pisten. 
Zum Abschluss lassen wir den Tag beim Après Ski in der Brent Alm an der Talstation ausklingen.

 **Abfahrtszeiten**
 - 05:15 Uhr Westhausen Turnhalle 
 - 05:25 Uhr Lauchheim Schule
 - 05:30 Uhr Hülen Bushaltestelle Wiesenweg
 - 05:40 Uhr Ebnat Jurahalle

**Rückfahrt**
 - 18:00 Uhr bis 18:30 Uhr

**Kosten**

|        Bus + Liftkarte      |   Mitglieder |  Nicht-Mtglieder |
|:----------------------------|-------------:|------------------:|
|  Erwachsene                 |   85,00 €    |  95,00 €          |
|                             |              |                   |
|                             |              |                   |
|  Schneeschuhe               |    5,00 €    |   5,00 €          |
|  Nur Busfahrt               |   30,00 €    |  30,00 €          |
`;

const BOARDING_LIST = [
    'Westhausen Turnhalle (5:15 Uhr)',
    'Lauchheim Schule (5:25 Uhr)',
    'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)',
    'Ebnat Jurahalle (5:40 Uhr)',
];

export const BLAULICHTAUSFAHRT_EHRWALD: Tile = {
    order: 5,
    behavior: TileBehavior.View,
    title: 'BLAULICHTAUSFAHRT EHRWALD',
    date: '21. Februar 2025',
    subTitle: '',
    image: '../../../../assets/img/cards/skis.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2025-02-21'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
};
