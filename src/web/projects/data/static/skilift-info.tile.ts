/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Tile, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `Der Skilift an der Kapfenburg ist geschlossen.

**Öffnungszeiten**
Aktuell ist der Liftbetrieb nicht möglich

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
    title: 'Kein Betrieb',
    date: 'SKILIFT KAPFENBURG GEÖFFNET',
    subTitle: 'ab 05. Februar 2026 geschlossen',
    image: '../../../../assets/img/cards/skilift_nacht.jpeg',
    imageDescription: 'Skilift',
    description: DESCRIPTION_TEXT,
    actions: [],
    avatar: 'https://avatars.githubusercontent.com/u/3502336?v=4',
    expiration: new Date('2026-03-31'),
    status: TileStatus.Open,
};
