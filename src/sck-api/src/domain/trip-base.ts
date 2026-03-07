/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Price structure
export interface PriceByMembership {
    member: number;
    nonMember: number;
}

// Membership
export type MembershipType = 'member' | 'nonMember';

// Categories by age
export type AgeCategory = 'adult' | 'youthUntil16' | 'childUntil6';
