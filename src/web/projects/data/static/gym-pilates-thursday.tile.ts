/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';
import { GymCourseInformation } from 'projects/gym-lib/src/lib/domain';

const DESCRIPTION_TEXT = `
Pilates ist ein effektives Ganzkörpertraining zur Kräftigung von Bauch, Rücken und Beckenboden.
Mit Fokus auf das „Powerhouse“, präzise Übungen und bewusste Atmung verbessert es Haltung und Körpergefühl.

**Termine**
- 8 x donnerstags 
- Start am 29. Jan. 2026
- Ende am 26. Mär. 2026
- 18:00 Uhr - 19:00 Uhr 
- im "Alten Schulhaus" in Hülen (Aalener Gasse 12)

**Kursgebühren**
- Mitglieder: 32,00 € (4 € à Kurseinheit)
- Nicht-Mtglieder: 48,00 € (6 € à Kurseinheit)
`;

export const GYM_PILATES_COURSE_INFORMATION_THU: GymCourseInformation = {
    name: 'Pilates (Donnerstags)',
    description: DESCRIPTION_TEXT,
    date: '29.01.2026 bis 26.03.2026',
    time: 'Donnerstags, 18:00 Uhr - 19:00 Uhr',
    location: 'Altes Schulhaus Hülen',
    contact: 'Mascha Welk',
    prices: {
        member: '32 EUR',
        nonMember: '48 EUR',
    },
};

export const GYM_PILATES_THURSDAY_TILE: Tile = {
    order: 2,
    behavior: TileBehavior.View,
    title: GYM_PILATES_COURSE_INFORMATION_THU.name,
    type: TileType.Course,
    date: GYM_PILATES_COURSE_INFORMATION_THU.date ?? '',
    subTitle: `${GYM_PILATES_COURSE_INFORMATION_THU.time} (${GYM_PILATES_COURSE_INFORMATION_THU.location})`,
    image: '../../../../assets/img/pilates/2026_01-03-thursday.png',
    imageDescription: 'pilates',
    description: DESCRIPTION_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2027-12-31'),
    status: TileStatus.Open,
    course: GYM_PILATES_COURSE_INFORMATION_THU,
};
