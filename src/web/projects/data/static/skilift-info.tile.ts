/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Tile, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Der Skilift an der Kapfenburg ist geöffnet.

**Weitere Öffnungszeiten**
- Sonntag, 4. Januar 2026: ab 10 Uhr
- Montag, 5. Januar 2026: ab 10 Uhr

**Preise 10er Karte**
- Kinder: 6€
- Erwachsene: 8€

---

_*Bei Bedarf wird abends das Flutlicht eingeschaltet._
`;

export const SKILIFT_INFO_TILE: Tile = {
    order: 1,
    type: TileType.Info,
    behavior: TileBehavior.Click,
    title: 'Skilift Kapfenhburg ist geöffnet',
    date: 'GEÖFFNET: 3. Jan 2026 ab 14 Uhr',
    subTitle: 'Januar 2026',
    image: '../../../../assets/img/cards/skilift_nacht.jpeg',
    imageDescription: 'Skilift',
    description: DESCRIPTION_TEXT,
    actions: [],
    downloadActionLink: 'https://1drv.ms/b/c/e16937961b6e725a/IQCn0TUDCXP5QIwb9XeWsjIkAbGbZXbJjH4wYnfRCxHQP98?e=ukyCEo',
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2026-12-31'),
    status: TileStatus.Open,
};
