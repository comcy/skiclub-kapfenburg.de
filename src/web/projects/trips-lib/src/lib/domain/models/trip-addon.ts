/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Bus only: Snow shoes
export interface SnowshoesAddon {
    kind: 'snowshoes';
}

// Training
export interface TechnikHalfAddon {
    kind: 'technikHalf';
}

export interface TechnikFullAddon {
    kind: 'technikFull';
}

// Courses
export interface BeginnerCourseAddon {
    kind: 'courseBeginner';
}

export interface AdvancedCourseAddon {
    kind: 'courseAdvanced';
}

// Addon groups types
export type AddonKind = 'snowshoes' | 'technikHalf' | 'technikFull' | 'courseBeginner' | 'courseAdvanced';

export type BusOnlyAddon = SnowshoesAddon;

export type BusLiftTechnicAddon = TechnikHalfAddon | TechnikFullAddon;

export type BusLiftFullAddon = TechnikHalfAddon | TechnikFullAddon | BeginnerCourseAddon | AdvancedCourseAddon;

export const DEFAULT_BUS_LIFT_FULL_ADDONS: AddonKind[] = [
    'technikHalf',
    'technikFull',
    'courseBeginner',
    'courseAdvanced',
];

export const DEFAULT_BUS_LIFT_COURSES_ONLY_ADDONS: AddonKind[] = ['courseBeginner', 'courseAdvanced'];

export const DEFAULT_BUS_LIFT_TRAINING_ONLY_ADDONS: AddonKind[] = ['courseBeginner', 'courseAdvanced'];

export const DEFAULT_BUS_ONLY_ADDONS: AddonKind[] = ['courseBeginner', 'courseAdvanced'];
