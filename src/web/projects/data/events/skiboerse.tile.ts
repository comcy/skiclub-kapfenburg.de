/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Tile, TileBehavior, TileStatus } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Ihr habt Zuhause ausgemistet, eure Kinder sind wieder gewachsen oder ihr möchtet einfach schauen, was es so gibt?
Dann kommt vorbei und beginnt gemeinsam mit uns die neue Wintersaison.

Unser erfahrenes Lehrteam wird für euch da sein und steht euch gern mit gutem Rat zur Seite.

**Ort:** Altes Schulhaus in Hülen

**Zeiten**
- 9:30 Uhr bis 11:30 Uhr Annahme
- 13:00 Uhr bis 14:30 Uhr Verkauf
- 14:30 Uhr bis 15:00 Uhr Abholung`;

export const SKIBOERSE_TILE: Tile = {
    order: 1,
    behavior: TileBehavior.View,
    title: 'Skibörse',
    date: '11. November 2023',
    subTitle: 'Altes Schulhaus Hülen',
    image: '../../../../assets/img/cards/skiboers.jpg',
    imageDescription: 'sample',
    description: DESCRIPTION_TEXT,
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2023-11-12'),
    status: TileStatus.Open,
};
