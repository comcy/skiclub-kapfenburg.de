/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

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

export const FREITAGSAUSFAHRT_EHRWALD: Tile = {
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'FREITAGSAUSFAHRT NACH EHRWALD',
    date: '6. Februar 2026',
    subTitle: '',
    image: '../../../../assets/img/cards/skis.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2026-02-07'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
};
