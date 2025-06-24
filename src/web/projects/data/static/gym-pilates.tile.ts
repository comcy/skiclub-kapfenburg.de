/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';

const DESCRIPTION_TEXT = `
Pilates ist ein effektives Ganzkörpertraining zur Kräftigung von Bauch, Rücken und Beckenboden.
Mit Fokus auf das „Powerhouse“, präzise Übungen und bewusste Atmung verbessert es Haltung und Körpergefühl.

**Termine**
- 7 x mittwochs 
- 8:30 Uhr - 09:30 Uhr 
- im "Alten Schulhaus" in Hülen

**Kursgebühren**
- Mitglieder: 28,00 € (4 € à Kurseinheit)
- Nicht-Mtglieder: 42,00 € (6 € à Kurseinheit)
`;

export const GYM_PILATES_TILE: Tile = {
    order: 4,
    behavior: TileBehavior.View,
    title: 'PILATES',
    type: TileType.Course,
    date: 'NEU ab Juli 2025',
    subTitle: 'Mittwochs, 8:30 Uhr - 09:30 Uhr (Altes Schulhaus Hülen)',
    image: 'https://cdn.pixabay.com/photo/2016/10/15/18/29/yoga-mat-1743203_960_720.jpg',
    imageDescription: 'pilates',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2027-12-31'),
    status: TileStatus.Open,
};
