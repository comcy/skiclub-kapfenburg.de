/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Bei dieser Ausfahrt geht es in das Traumskigebiet Mellau-Damüls. Dieses befindet 
sich mitten im Bregenzerwald und ist das größte Gebiet in der Region. Es bietet über 
100km schneesichere Pisten. 
Neben den vielen Pisten von leicht bis sehr anspruchsvoll kommen die 
Genussfahrer, Schneekids, Freestyler und Freerider voll auf ihre Kosten. 
Tobt euch aus auf den bestens präparierten Pisten, im Snowpark, auf der SpeedStrecke, im Skitunnel oder auf der Skiroute. 
Auch für Anfänger ist diese Ausfahrt bestens geeignet: Ihr müsst nicht am Übungslift 
an der Talstation bleiben, denn im Mellauer Teil des Gebietes gibt es viele einfachere 
Pisten, die gut zu bewältigen sind.

 **Abfahrtszeiten**
 - 05:15 Uhr Westhausen Turnhalle 
 - 05:25 Uhr Lauchheim Schule

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

const BOARDING_LIST = ['Westhausen Turnhalle (5:15 Uhr)', 'Lauchheim Schule (5:25 Uhr)'];

export const TAGESAUSFAHRT_MELLAU_DAMUELS: Tile = {
    order: 5,
    behavior: TileBehavior.View,
    title: 'TAGESAUSFAHRT NACH MELLAU-DAMÜLS',
    date: '27. Januar 2024',
    subTitle: '',
    image: '../../../../assets/img/cards/snow.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2024-01-27'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
};
