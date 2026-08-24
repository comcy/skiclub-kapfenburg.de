/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { TripConfig } from './trip-config';

export interface Trip {
    // Optional so the two existing call sites (RegistrationComponent,
    // TripDetailComponent) don't need to change their static-fallback paths -
    // only set when the source is an sck-api tile, which is what the public
    // registration flow needs to submit a capacity-aware registration.
    id?: string;
    destination: string;
    date: string;
    availableBoardings: string[];
    tripConfig?: TripConfig;
}

// Price structure
export interface PriceByMembership {
    member: number;
    nonMember: number;
}

// Membership
export type MembershipType = 'member' | 'nonMember';

// Categories by age
export type AgeCategory = 'adult' | 'youthUntil16' | 'childUntil6';
