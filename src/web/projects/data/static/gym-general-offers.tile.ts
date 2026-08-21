/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { InfoTile, TileBehavior, TileStatus, TileType } from '@shared/ui-common';
import { GymCourseInformation } from 'projects/gym-lib/src/lib/domain';

// Herbstferien BW 2026: 26.-31.10.2026, Weihnachtsferien BW 2026/27: 23.12.2026-09.01.2027
const AUTUMN_AND_CHRISTMAS_BREAK_MONDAYS = [new Date('2026-10-26'), new Date('2026-12-28'), new Date('2027-01-04')];
const AUTUMN_AND_CHRISTMAS_BREAK_WEDNESDAYS = [
    new Date('2026-10-28'),
    new Date('2026-12-23'),
    new Date('2026-12-30'),
    new Date('2027-01-06'),
];

export const GYM_FITNESS_COCKTAIL_INFORMATION: GymCourseInformation = {
    name: 'Fitness Cocktail',
    time: 'Montags, 19:00 – 20:00 Uhr',
    location: 'Schulturnhalle Lauchheim',
    description: 'Fitness / Gymnastik für Jedermann - findet ganzjährig statt, ausser in den Ferien',
    details: '',
    contact: 'Katharina Sachs und Anna Klein, Tel: 07363/3492',
    schedule: {
        weekday: 1, // Montag
        startDate: new Date('2026-09-14'),
        endDate: new Date('2027-01-31'),
        excludedDates: AUTUMN_AND_CHRISTMAS_BREAK_MONDAYS,
    },
};

export const GYM_FITNESSMIX_INFORMATION: GymCourseInformation = {
    name: 'Fitnessmix',
    time: 'Montags, 20:00 – 21:00 Uhr',
    location: 'Altes Schulhaus Hülen',
    description:
        'Ein Mix aus Kräftigung und Ausdauer mit und ohne Handgeräte; Tiefenmuskel- und Koordinationstraining sowie Haltungsstabilisation',
    details: '',
    contact: 'Monika Mayer, Tel: 07363/4432',
    schedule: {
        weekday: 1, // Montag
        startDate: new Date('2026-09-14'),
        endDate: new Date('2027-01-31'),
        excludedDates: AUTUMN_AND_CHRISTMAS_BREAK_MONDAYS,
    },
};

export const GYM_VITALGYMNASTIK_INFORMATION: GymCourseInformation = {
    name: 'Vitalgymnastik 50 Plus',
    time: 'Mittwochs, 19:00 – 20:00 Uhr',
    location: 'Altes Schulhaus Hülen',
    description:
        '(gemischte Gruppe) Funktionelle Gymnastik zur Stabilisierung des Rückens, vielseitige körperliche Bewegungsübungen sowie Entspannung stärken die Leistungsfähigkeit.',
    details: '',
    contact: 'Monika Mayer, Tel: 07363/4432',
    schedule: {
        weekday: 3, // Mittwoch
        startDate: new Date('2026-09-14'),
        endDate: new Date('2027-01-31'),
        excludedDates: AUTUMN_AND_CHRISTMAS_BREAK_WEDNESDAYS,
    },
};

/**
 * Public, non-bookable Gymnastik offers (no registration - just the running
 * weekly sessions described on the Gymnastik information page). Kept here, as the
 * single source of truth, so GymInformationProviderService and the home page
 * calendar both read the same data.
 */
export const GYM_GENERAL_OFFERS: GymCourseInformation[] = [
    GYM_FITNESS_COCKTAIL_INFORMATION,
    GYM_VITALGYMNASTIK_INFORMATION,
    GYM_FITNESSMIX_INFORMATION,
];

/**
 * Display tiles for the two Monday groups, shown as cards on the Gymnastik
 * information page. No registration/detail page - purely informational, so
 * no actions/image (rendered with a placeholder icon instead, see
 * gym-general-information.component).
 */
export const GYM_FITNESS_COCKTAIL_TILE: InfoTile = {
    id: 'fitness-cocktail',
    order: 3,
    type: TileType.Info,
    behavior: TileBehavior.View,
    title: GYM_FITNESS_COCKTAIL_INFORMATION.name,
    date: '',
    subTitle: GYM_FITNESS_COCKTAIL_INFORMATION.time,
    image: '',
    imageDescription: GYM_FITNESS_COCKTAIL_INFORMATION.name,
    description: GYM_FITNESS_COCKTAIL_INFORMATION.description,
    details: '',
    location: GYM_FITNESS_COCKTAIL_INFORMATION.location,
    expiration: new Date('2027-12-31'),
    status: TileStatus.Open,
};

export const GYM_FITNESSMIX_TILE: InfoTile = {
    id: 'fitnessmix',
    order: 3,
    type: TileType.Info,
    behavior: TileBehavior.View,
    title: GYM_FITNESSMIX_INFORMATION.name,
    date: '',
    subTitle: GYM_FITNESSMIX_INFORMATION.time,
    image: '',
    imageDescription: GYM_FITNESSMIX_INFORMATION.name,
    description: GYM_FITNESSMIX_INFORMATION.description,
    details: '',
    location: GYM_FITNESSMIX_INFORMATION.location,
    expiration: new Date('2027-12-31'),
    status: TileStatus.Open,
};

export const GYM_MONDAY_TILES: InfoTile[] = [GYM_FITNESS_COCKTAIL_TILE, GYM_FITNESSMIX_TILE];
