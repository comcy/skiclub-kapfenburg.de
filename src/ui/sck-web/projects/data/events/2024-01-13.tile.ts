/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Diese Ausfahrt eignet sich sowohl für reine Anfänger als auch für Fortgeschrittene. 
Egal ob ihr das erste Mal auf Skiern oder dem Board steht oder einfach eure Technik 
verbessern wollt – hier seid ihr richtig! 
Unser erfahrenes Lehrteam trainiert mit euch auf der Piste und bei Bedarf gerne im 
Funpark.
In dieser Saison fahren wir mit euch in das „familienfreundlichste Skigebiet in den 
Alpen“. Dort gibt es über 30km traumhafte Pisten auf fast 1600m Höhe. Für alle, die 
sich im Funpark austoben möchten, bietet der „Easypark“ die perfekte Gelegenheit 
dazu.

 **Abfahrtszeiten**
 - 05:15 Uhr Westhausen Turnhalle 
 - 05:25 Uhr Lauchheim Schule

**Kosten**

|        Bus + Liftkarte      |   Mitglieder |  Nicht-Mtglieder |
|:----------------------------|-------------:|------------------:|
|  Erwachsene                 |   75,00 €    |  85,00 €          |
|  Jugendliche bis 16 Jahre   |   65,00 €    |  75,00 €          | 
|  Kinder bis 6 Jahre         |   50,00 €    |  55,00 €          |
|                             |              |                   |
|                             |              |                   |
|                             |              |                   |
|  Kurse                      |   35,00 €    |  40,00 €          |
|  Schneeschuhe               |   5,00 €     |  5,00 €           |
|  Nur Busfahrt               |   30,00 €    |  30,00 €          |

`;

const BOARDING_LIST = ['Westhausen Turnhalle (5:15 Uhr)', 'Lauchheim Schule (5:25 Uhr)'];

export const TRAININGSTAG_OBERJOCH_TILE: Tile = {
    order: 4,
    behavior: TileBehavior.View,
    title: 'TRAININGSTAG IN OBERJOCH',
    date: '13. Januar 2024',
    subTitle: '',
    image: '../../../../assets/img/cards/piste2.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2024-01-13'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
};
