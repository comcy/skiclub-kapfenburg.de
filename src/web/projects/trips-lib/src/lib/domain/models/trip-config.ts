/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { TripPricing } from './trip-pricing';

export interface TripConfig {
    // Optional since it's no longer admin-entered per trip - the public site
    // computes it live from the global trip-pricing setting, see
    // sck-app's trip-tiles-api.service.ts. Still the shape everything
    // downstream (TripPricingDialogComponent, TripsRegistrationFormComponent)
    // consumes unchanged.
    pricing?: TripPricing;
    // Admin-set marker ("Ausfahrt mit Kursmöglichkeit") - controls whether
    // the course/technik/snowshoe addon rows get merged into `pricing` on
    // the public site.
    hasCourseOption?: boolean;
    customBccList?: string[];
}
