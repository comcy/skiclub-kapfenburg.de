/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { TripOptions } from './trip-options';
import { TripPricing } from './trip-pricing';

export interface TripConfig {
    pricing: TripPricing;
    options: TripOptions;
    availableCourses?: ('courseBeginner' | 'courseAdvanced')[];
}
