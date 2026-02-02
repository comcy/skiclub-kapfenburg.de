/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Tile, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Der Skilift an der Kapfenburg ist ab dem 31. Januar geöffnet.

**Öffnungszeiten**
- Samstag / Sonntag: ab 10 Uhr geöffnet
- Wochentags: ab 16 Uhr geöffnet

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
    title: 'Betrieb am Wochenende ab 10 Uhr / Wochentags ab 16 Uhr',
    date: 'SKILIFT KAPFENBURG GEÖFFNET',
    subTitle: 'ab 31. Januar 2026 geöffnet',
    image: '../../../../assets/img/cards/skilift_nacht.jpeg',
    imageDescription: 'Skilift',
    description: DESCRIPTION_TEXT,
    actions: [],
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2026-12-31'),
    status: TileStatus.Open,
};
