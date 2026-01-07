/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Tile, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Der Skilift an der Kapfenburg ist geöffnet.

**Öffnungszeiten**
- am 8. Januar 2026: ab 15:00 Uhr
- am 9. Januar 2026: ab 15:00 Uhr
- am 10. Januar 2026: ab 10:00 Uhr
- am 11. Januar 2026: ab 10:00 Uhr

**Preise 10er Karte**
- Kinder: 6€
- Erwachsene: 8€

---

_*Bei Bedarf wird abends das Flutlicht eingeschaltet._
_*Betrieb nur bei ausreichender Schneelage._
`;

export const SKILIFT_INFO_TILE: Tile = {
    order: 1,
    type: TileType.Info,
    behavior: TileBehavior.Click,
    title: 'Betrieb ab 10 Uhr an Wochenenden',
    date: 'SKILIFT KAPFENBURG GEÖFFNET',
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
