/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `
Eine Ausfahrt für alle, die unter der Woche Zeit haben und freie Pisten lieben.
Zusammen mit dem Freizeitclub La-Oele geht es nach Montafon ins Skigebiet „Silvretta“ mit Übernachtung im Hotel Lifestyle/Bludenz. 
Das Skigebiet bietet über 140 Pistenkilometer für Skifahrer und Snowboarder aller Levels. 
Mit modernen Liftanlagen und einer beeindruckenden Alpenlandschaft ist es ein beliebtes Ziel für Wintersportler. 
Neben Skifahren kann man auch Rodeln und Winterwandern genießen. Die gemütichen Hütten laden zum Entspannen ein.

**Ziel**
- Montafon "Silvretta"

**Abfahrtszeiten**
 - 05:00 Uhr Schwabsberg Schule 
 - 05:15 Uhr Westhausen Turnhalle

**Kosten**

|                             |              |
|:----------------------------|-------------:|
|  Erwachsene:                |   260,00 €*  |

---

**Im Preis enthalten ist die Busfahrt mit Vesper, 2-Tages-Skipass und eine Überachtung inklusive Halbpension*

`;

const BOARDING_LIST = ['Schwabsberg (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'];

export const FREIE_PISTENAUSFAHRT: Tile = {
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: '2-TAGES "FREIE PISTEN" AUSFAHRT"',
    date: '16. bis 17. März 2026',
    subTitle: 'Ab 18 Jahren',
    image: '../../../../assets/img/cards/ski.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2026-03-17'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
};
