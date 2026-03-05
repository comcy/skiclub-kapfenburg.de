/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// ===== BusOnly Addon =====
export interface SnowshoesAddon {
    kind: 'snowshoes';
}

// ===== Techniktraining =====
export interface TechnikHalfAddon {
    kind: 'technikHalf';
}

export interface TechnikFullAddon {
    kind: 'technikFull';
}

// ===== Kurs Addons =====
export interface BeginnerCourseAddon {
    kind: 'courseBeginner';
}

export interface AdvancedCourseAddon {
    kind: 'courseAdvanced';
}

// ===== Addon Gruppen =====
export type BusOnlyAddon = SnowshoesAddon;

export type BusLiftAddon = TechnikHalfAddon | TechnikFullAddon | BeginnerCourseAddon | AdvancedCourseAddon;
