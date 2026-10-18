// Reuses trips-lib's TripPricing shape directly (already a shared
// dependency via tile.ts's TripConfig import) rather than a third
// hand-kept copy - this IS the global setting TripConfig.pricing now
// gets computed from, see the price-management component.
export type { TripPricing as TripPricingSetting } from 'projects/trips-lib/src/lib/domain/models/trip-pricing';
