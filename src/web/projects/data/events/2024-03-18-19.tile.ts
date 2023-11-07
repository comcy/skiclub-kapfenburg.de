/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Eine Ausfahrt für alle, die unter der Woche Zeit haben und freie Pisten lieben. Zusammen mit dem Freizeitclub La-Oele geht es ins Allgäu mit Übernachtung im „Explorer“ Hotel.

**Ziel**
- Allgäu / Fellhorn

**Abfahrtszeiten**
 - 05:00 Uhr Schwabsberg Schule 
 - 05:15 Uhr Westhausen Turnhalle

**Kosten**

|                             |              |
|:----------------------------|-------------:|
|  Erwachsene:                |   230,00 €*  |

---

**Im Preis enthalten ist die Busfahrt mit Vesper, 2-Tages-Skipass und eine Überachtung inklusive Halbpension*

`;

const BOARDING_LIST = ['Schwabsberg (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'];

export const FREIE_PISTENAUSFAHRT: Tile = {
    order: 5,
    behavior: TileBehavior.View,
    title: '2-TAGES "FREIE PISTEN" AUSFAHRT"',
    date: '18. bis 19. März 2024',
    subTitle: 'Ab 18 Jahren',
    image: '../../../../assets/img/cards/ski.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2024-03-19'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
};
