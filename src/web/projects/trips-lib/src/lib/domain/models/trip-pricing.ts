/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { AgeCategory, PriceByMembership } from './trip-base';

export interface TripPricing {
    busLift: Record<AgeCategory, PriceByMembership>;
    busOnly: PriceByMembership;

    addons: {
        snowshoes?: PriceByMembership;
        technikHalf?: PriceByMembership;
        technikFull?: PriceByMembership;

        courseBeginner?: PriceByMembership;
        courseAdvanced?: PriceByMembership;
    };
}
