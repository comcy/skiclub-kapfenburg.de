/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { TripConfig } from './trip-config';

export interface Trip {
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
