/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { AgeCategory, PriceByMembership } from './trip-base';

export interface TripAddons {
    snowshoes?: PriceByMembership;
    technikHalf?: PriceByMembership;
    technikFull?: PriceByMembership;
    courseBeginner?: PriceByMembership;
    courseAdvanced?: PriceByMembership;
}

export interface TripPricing {
    busLift?: Record<AgeCategory, PriceByMembership>;
    busOnly?: PriceByMembership;
    addons?: TripAddons;
}

/**
 * Default pricing for standard trips.
 * Can be used as a base and overridden in event configurations.
 */
export const DEFAULT_TRIP_PRICING: TripPricing = {
    busOnly: {
        member: 30,
        nonMember: 30,
    },
    addons: {
        snowshoes: {
            member: 5,
            nonMember: 5,
        },
    },
};
