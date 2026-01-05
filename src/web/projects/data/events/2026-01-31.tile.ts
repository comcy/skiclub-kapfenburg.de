/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Auch in dieser Saison darf unser Klassiker, die Ausfahrt nach Ehrwald, nicht fehlen. 
Dieses Gebiet verfügt über wunderschöne, leichte bis mittelschwere Waldpisten. 
Besonders Familien finden hier traumhafte Bedingungen vor. Für jeden ist etwas dabei - seien es die breiten Pisten, der Funpark oder die Funslope mit Wellen, Tunneln und 
Schneeschnecke. 

Falls ihr doch lieber die Gegend zu Fuß erkundet, könnt ihr direkt an der Ehrwalder 
Almbahn loslegen: Von dort aus starten zwei schöne Winterwanderwege und Schneeschuhtrails

 **Abfahrtszeiten**
 - 05:15 Uhr Westhausen Turnhalle 
 - 05:25 Uhr Lauchheim Schule
 - 05:30 Uhr Hülen Bushaltestelle Wiesenweg

**Kosten**

|        Bus + Liftkarte      |   Mitglieder |  Nicht-Mtglieder |
|:----------------------------|-------------:|------------------:|
|  Erwachsene                 |   90,00 €    |  100,00 €          |
|  Jugendliche bis 16 Jahre   |   65,00 €    |  75,00 €          | 
|  Kinder bis 6 Jahre         |   50,00 €    |  55,00 €          |
|                             |              |                   |
|                             |              |                   |
|                             |              |                   |
|  Anfängerkurse              |   35,00 €    |  40,00 €          |
|  Techniktraining 1/2 Tag    |   35,00 €    |  30,00 €          |
|  Techniktraining            |   60,00 €    |  55,00 €          |
|  Schneeschuhe               |   5,00 €     |  5,00 €           |
|  Nur Busfahrt               |   30,00 €    |  30,00 €          |

`;

const BOARDING_LIST = [
    'Westhausen Turnhalle (5:15 Uhr)',
    'Lauchheim Schule (5:25 Uhr)',
    'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)',
];

export const TAGESAUSFAHRT_EHRWALD: Tile = {
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'TAGESAUSFAHRT NACH EHRWALD',
    date: '31. Januar 2026',
    subTitle: 'Familienfreundlich',
    image: '../../../../assets/img/cards/huette.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2026-02-01'),
    boardings: BOARDING_LIST,
    status: TileStatus.BookedUp,
};
