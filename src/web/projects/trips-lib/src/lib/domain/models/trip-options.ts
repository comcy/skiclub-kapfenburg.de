/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

export interface TripOptions {
    allowBusLift: boolean;
    allowBusOnly: boolean;
    allowSnowshoes?: boolean;
}

export const DEFAULT_TRIP_OPTIONS: TripOptions = {
    allowBusLift: true,
    allowBusOnly: true,
    allowSnowshoes: true,
};
