/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Kommt mit uns in die Tiroler Zugspitz-Arena nach Lermoos. Im Skigebiet Grubigstein steht auf 1000 - 2100m Höhe wintersportlicher Spaß auf dem Programm. Zwölf 
Abfahrten bringen Abwechslung. Auch für das leibliche Wohl ist gesorgt: Zahlreiche 
Hütten bieten Gelegenheit zum Einkehrschwung. 
Den Schneetag lassen wir ausklingen beim Aprés Ski in der „Lahmen Ente“ direkt 
an der Talstation. Hierfür ist genügend Zeit eingeplant, denn es geht erst um 19 Uhr 
zurück Richtung Heimat.

 **Abfahrtszeiten**
 - 05:00 Uhr Schwabsberg Schule
 - 05:15 Uhr Westhausen Turnhalle 
 - 05:25 Uhr Lauchheim Schule

**Rückfahrt**
- 19:00 Uhr

**Kosten**

|                                 |               |
|:--------------------------------|--------------:|
|  Bus + Liftkarte + kl. Vesper   |   89,00 €     |
|  Schneeschuhe                   |    5,00 €     |
`;

const BOARDING_LIST = [
    'Schwabsberg Schule (5:00 Uhr)',
    'Westhausen Turnhalle (5:15 Uhr)',
    'Lauchheim Schule (5:25 Uhr)',
];

export const PARTYAUSFAHRT_LERMOOS: Tile = {
    order: 6,
    behavior: TileBehavior.View,
    title: 'PARTYAUSFAHRT NACH LERMOOS',
    date: '17. Februar 2024',
    subTitle: 'Ausfahrt ab 18 Jahre',
    image: '../../../../assets/img/cards/lift.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2024-02-17'),
    boardings: BOARDING_LIST,
    status: TileStatus.Open,
};
