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
 - 05:35 Uhr Ebnat Jurahalle

**Rückfahrt**
 - 18:00 Uhr bis 18:30 Uhr

**Kosten**

|        Bus + Liftkarte      |   Mitglieder |  Nicht-Mtglieder |
|:----------------------------|-------------:|------------------:|
|  Erwachsene                 |   80,00 €    |  90,00 €          |
|  Jugendliche bis 16 Jahre   |   70,00 €    |  80,00 €          | 
|  Kinder bis 6 Jahre         |   55,00 €    |  60,00 €          |
|                             |              |                   |
|                             |              |                   |
|                             |              |                   |
|  Kurse                      |   35,00 €    |  40,00 €          |
|  Schneeschuhe               |    5,00 €    |   5,00 €          |
|  Nur Busfahrt               |   30,00 €    |  30,00 €          |

`;

const BOARDING_LIST = ['Westhausen Turnhalle (5:15 Uhr)', 'Lauchheim Schule (5:25 Uhr)', 'Ebnat Jurahalle (5:35 Uhr)'];

export const BLAULICHTAUSFAHRT_EHRWALD: Tile = {
    order: 5,
    behavior: TileBehavior.View,
    title: 'BLAULICHTAUSFAHRT EHRWALD',
    date: '01. März 2024',
    subTitle: '',
    image: '../../../../assets/img/cards/skis.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2024-03-01'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
};
