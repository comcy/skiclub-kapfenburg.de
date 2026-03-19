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
- 12 x donnerstags 
- Start am 16. Apr. 2026
- Ende am (einschl.) 23. Jul. 2026
- 18:00 Uhr - 19:00 Uhr 
- im "Alten Schulhaus" in Hülen (Aalener Gasse 12)
- Kurs pausiert in den Pfingstferien / Feiertagen

**Kursgebühren**
- Mitglieder: 48,00 € (4 € à Kurseinheit)
- Nicht-Mtglieder: 72,00 € (6 € à Kurseinheit)
`;

export const GYM_PILATES_COURSE_INFORMATION_THU: GymCourseInformation = {
    name: 'Pilates (Donnerstags)',
    description: DESCRIPTION_TEXT,
    details: DETAILS_TEXT,
    date: '16.04.2026 bis (einschl.) 23.07.2026',
    time: 'Donnerstags, 18:00 Uhr - 19:00 Uhr',
    location: 'Altes Schulhaus Hülen',
    contact: 'Mascha Welk',
    prices: {
        member: '48 EUR',
        nonMember: '72 EUR',
    },
};

export const GYM_PILATES_THURSDAY_TILE: Tile = {
    order: 2,
    behavior: TileBehavior.View,
    title: GYM_PILATES_COURSE_INFORMATION_THU.name,
    type: TileType.Course,
    date: GYM_PILATES_COURSE_INFORMATION_THU.date ?? '',
    subTitle: `${GYM_PILATES_COURSE_INFORMATION_THU.time} (${GYM_PILATES_COURSE_INFORMATION_THU.location})`,
    image: '../../../../assets/img/pilates/2026_04-07_thursday.png',
    imageDescription: 'pilates',
    description: DESCRIPTION_TEXT,
    details: DETAILS_TEXT,
    actions: [TileActions.Register],
    expiration: new Date('2027-12-31'),
    status: TileStatus.Open,
    course: GYM_PILATES_COURSE_INFORMATION_THU,
};
