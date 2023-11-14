/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

const DESCRIPTION_TEXT = `An unserer Montagsausfahrt geht es traditionell nach Oberstdorf zum Skigebiet Fellhorn/Kanzelwand. Hier erwartet euch ein abwechslungsreiches Skigebiet mit 36 bestens präparierten Pisten für jedes Level. 
Das Gebiet verfügt über eine der modernsten Beschneiungsanlagen in Deutschland, womit dem Schneevergnügen nichts mehr im Wege steht. 

Nach einem tollen Schneetag lassen wir den Tag mit Kaffee und Kuchen am Bus oder an der Aprés Ski Bar ausklingen.

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
|  Schneeschuhe               |    5,00 €    |   5,00 €          |
|  Nur Busfahrt               |   30,00 €    |  30,00 €          |

`;

const BOARDING_LIST = ['Westhausen Turnhalle (5:15 Uhr)', 'Lauchheim Schule (5:25 Uhr)'];

export const MONTAGSAUSFAHRT_FELLHORN: Tile = {
    id: '8ce3487f-0490-441a-903a-5c300d5a2163',
    order: 5,
    behavior: TileBehavior.View,
    title: 'MONTAGSAUSFAHRT FELLHORN',
    date: '04. März 2024',
    subTitle: '',
    image: '../../../../assets/img/cards/skiing.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2024-03-04'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
};
