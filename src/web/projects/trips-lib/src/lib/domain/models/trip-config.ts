/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { TripPricing } from './trip-pricing';

export interface TripConfig {
    // Admin-entered per trip (Tile-Editor, Issue #217) - optional because a
    // brand-new tile without its own pricing yet falls back to the global
    // Preismanagement setting, see sck-app's trip-tiles-api.service.ts.
    pricing?: TripPricing;
    // Admin-set marker ("Ausfahrt mit Kursmöglichkeit") - controls whether
    // the course/technik/snowshoe addon rows get merged into `pricing` on
    // the public site.
    hasCourseOption?: boolean;
    customBccList?: string[];
}
