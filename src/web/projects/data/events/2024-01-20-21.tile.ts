/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Bei unser diesjährigen Kooperationsausfahrt mit dem Freizeitclub La-Oele geht es wieder nach Vorarlberg ins Skigebiet Golm mit Übernachtung im Hotel „Weisses Kreuz“ in Feldkirch.

**Ziel**
 - Vorarlberg, Skigebiet Golm

**Abfahrtszeiten**
 - 05:00 Uhr Schwabsberg Schule 
 - 05:15 Uhr Westhausen Turnhalle

**Kosten**

|                             |              |
|:----------------------------|-------------:|
|  Erwachsene                 |   225,00 €*  |
|  Jugendliche bis 16 Jahre   |   170,00 €*  | 
|  Kinder bis 6 Jahre         |   85,00 €*   |

--- 

**Im Preis enthalten ist die Busfahrt mit Vesper, 2-Tages-Skipass und eine Überachtung inklusive Halbpension*

`;

const BOARDING_LIST = ['Schwabsberg (5:00 Uhr)', 'Westhausen Turnhalle (5:15 Uhr)'];

export const LA_OELE_AUSFAHRT: Tile = {
    id: '6f575916-54f3-46ed-abe1-1e7d5abb8f93',
    order: 5,
    behavior: TileBehavior.View,
    title: 'LA OELE 2-TAGES SKIAUSFAHRT NACH GOLM',
    date: '20. bis 21. Januar 2024',
    subTitle: '',
    image: '../../../../assets/img/cards/snowboarding.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2024-01-21'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
};
