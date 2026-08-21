/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { Tile, TileActions, TileBehavior, TileStatus, TileType } from '@shared/ui-common';
import { GymCourseInformation } from 'projects/gym-lib/src/lib/domain';

const DESCRIPTION_TEXT = `
Pilates ist ein effektives Ganzkörpertraining zur Kräftigung von Bauch, Rücken und Beckenboden.
Mit Fokus auf das „Powerhouse“, präzise Übungen und bewusste Atmung verbessert es Haltung und Körpergefühl.
`;

const DETAILS_TEXT = `
**Termine**
- 12 x mittwochs 
- Start am 23. Sep. 2026
- Ende am (einschl.) 16. Dez. 2026
- 8:30 Uhr - 09:30 Uhr 
- im "Alten Schulhaus" in Hülen (Aalener Gasse 12)
- Kurs pausiert in den Herbstferien

**Kursgebühren**
- Mitglieder: 48,00 € (4 € à Kurseinheit)
- Nicht-Mtglieder: 72,00 € (6 € à Kurseinheit)
`;

export const GYM_PILATES_COURSE_INFORMATION_WED: GymCourseInformation = {
    name: 'Pilates (Mittwochs)',
    description: DESCRIPTION_TEXT,
    details: DETAILS_TEXT,
    date: '23.09.2026 bis (einschl.) 16.12.2026',
    time: 'Mittwochs, 8:30 Uhr - 09:30 Uhr',
    location: 'Altes Schulhaus Hülen',
    contact: 'Mascha Welk',
    prices: {
        member: '48 EUR',
        nonMember: '72 EUR',
    },
    schedule: {
        weekday: 3, // Mittwoch
        startDate: new Date('2026-09-23'),
        endDate: new Date('2026-12-16'),
        excludedDates: [],
    },
};

export const GYM_PILATES_WEDNESDAY_TILE: Tile = {
    id: 'pilates-wed',
    order: 2,
    behavior: TileBehavior.View,
    title: GYM_PILATES_COURSE_INFORMATION_WED.name,
    type: TileType.Course,
    date: GYM_PILATES_COURSE_INFORMATION_WED.date ?? '',
    subTitle: `${GYM_PILATES_COURSE_INFORMATION_WED.time} (${GYM_PILATES_COURSE_INFORMATION_WED.location})`,
    image: '../../../../assets/img/pilates/2026_07-03_wednesday.png',
    imageDescription: 'pilates',
    description: DESCRIPTION_TEXT,
    details: DETAILS_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2027-12-31'),
    status: TileStatus.Open,
    course: GYM_PILATES_COURSE_INFORMATION_WED,
    location: 'Altes Schulhaus Hülen',
};
