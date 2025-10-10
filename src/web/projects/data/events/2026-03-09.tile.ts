/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `An unserer Montagsausfahrt geht es traditionell nach Oberstdorf zum Skigebiet Fellhorn/Kanzelwand. Hier erwartet euch ein abwechslungsreiches Skigebiet mit 36 bestens präparierten Pisten für jedes Level. 
Das Gebiet verfügt über eine der modernsten Beschneiungsanlagen in Deutschland, womit dem Schneevergnügen nichts mehr im Wege steht. 

Nach einem tollen Schneetag lassen wir den Tag mit Kaffee und Kuchen am Bus oder an der Aprés Ski Bar ausklingen.

 **Abfahrtszeiten**
 - 05:15 Uhr Westhausen Turnhalle 
 - 05:25 Uhr Lauchheim Schule 
 - 05:30 Uhr Hülen Bushaltestelle Wiesenweg

**Kosten**

|        Bus + Liftkarte      |   Mitglieder |  Nicht-Mtglieder |
|:----------------------------|-------------:|------------------:|
|  Erwachsene                 |   80,00 €    |  90,00 €          |
|  Jugendliche bis 16 Jahre   |   70,00 €    |  80,00 €          | 
|  Kinder bis 6 Jahre         |   55,00 €    |  60,00 €          |
|                             |              |                   |
|                             |              |                   |
|                             |              |                   |
|  Techniktraining 1/2 Tag    |   35,00 €    |  40,00 €          |
|  Techniktraining            |   60,00 €    |  65,00 €          |
|  Schneeschuhe               |   5,00 €     |  5,00 €           |
|  Nur Busfahrt               |   30,00 €    |  30,00 €          |

_Hinweis: Keine Anfänger_
`;

const BOARDING_LIST = [
    'Westhausen Turnhalle (5:15 Uhr)',
    'Lauchheim Schule (5:25 Uhr)',
    'Hülen Bushaltestelle (5:30 Uhr)',
];

export const MONTAGSAUSFAHRT_FELLHORN: Tile = {
    order: 5,
    type: TileType.Event,
    behavior: TileBehavior.View,
    title: 'MONTAGSAUSFAHRT FELLHORN',
    date: '09. März 2026',
    subTitle: '',
    image: '../../../../assets/img/cards/skiing.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2026-03-10'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
};
