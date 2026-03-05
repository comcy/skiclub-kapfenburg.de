/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { BusLiftAddon, BusOnlyAddon } from './trip-addon';
import { MembershipType } from './trip-base';
import { BusLiftBase, BusOnlyBase } from './trip-product';

export interface BusLiftBooking {
    base: BusLiftBase;
    membership: MembershipType;
    addons?: BusLiftAddon[];
}

export interface BusOnlyBooking {
    base: BusOnlyBase;
    membership: MembershipType;
    addons?: BusOnlyAddon[];
}

export type Booking = BusLiftBooking | BusOnlyBooking;
