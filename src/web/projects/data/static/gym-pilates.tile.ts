/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus } from '@shared/ui-common';

const DESCRIPTION_TEXT = `
Pilates ist ein effektives Ganzkörpertraining zur Kräftigung von Bauch, Rücken und Beckenboden.
Mit Fokus auf das „Powerhouse“, präzise Übungen und bewusste Atmung verbessert es Haltung und Körpergefühl.

**Kursleitung** 
- Mascha Welk (Pilates-Trainerin)
- Teilnehmerzahl ist begrenzt
    
**Termine**
- 10 x mittwochs 
- 9:00 Uhr - 10:00 Uhr 
- im "Alten Schulhaus" in Hülen

**Kursgebühren**
- Mitglieder: 40,00 €
- Nicht-Mtglieder: 60,00 €
`;

export const GYM_PILATES_TILE: Tile = {
    order: 4,
    behavior: TileBehavior.View,
    title: 'PILATES Kurse',
    date: 'NEU ab Juli 2025',
    subTitle: 'Mittwochs, 9:00 Uhr - 10:00 Uhr (Altes Schulhaus Hülen)',
    image: 'https://cdn.pixabay.com/photo/2016/10/15/18/29/yoga-mat-1743203_960_720.jpg',
    imageDescription: 'pilates',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2027-12-31'),
    status: TileStatus.Open,
};
