/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `
Pilates ist ein effektives Ganzkörpertraining zur Kräftigung von Bauch, Rücken und Beckenboden.
Mit Fokus auf das „Powerhouse“, präzise Übungen und bewusste Atmung verbessert es Haltung und Körpergefühl.

**Termine**
- 10 x mittwochs 
- Start am 14. Jan. 2026
- Ende am 25. Mär. 2026
- 8:30 Uhr - 09:30 Uhr 
- im "Alten Schulhaus" in Hülen (Aalener Gasse 12)

**Kursgebühren**
- Mitglieder: 40,00 € (4 € à Kurseinheit)
- Nicht-Mtglieder: 60,00 € (6 € à Kurseinheit)
`;

export const GYM_PILATES_WEDNESDAY_TILE: Tile = {
    order: 2,
    behavior: TileBehavior.View,
    title: 'Pilates (Mittwochs)',
    type: TileType.Course,
    date: '14.01.2026 bis 25.03.2026',
    subTitle: 'Mittwochs, 8:30 Uhr - 09:30 Uhr (Altes Schulhaus Hülen)',
    image: '../../../../assets/img/pilates/2026_01-03.png',
    imageDescription: 'pilates',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2027-12-31'),
    status: TileStatus.Open,
};
