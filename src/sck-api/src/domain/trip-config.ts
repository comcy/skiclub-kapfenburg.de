/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { TripPricing } from './trip-pricing';

export interface TripConfig {
    pricing: TripPricing;
    customBccList?: string[];
}
