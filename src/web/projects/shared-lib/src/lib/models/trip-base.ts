/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Mitgliedschaft
export type MembershipType = 'member' | 'nonMember';

// Alterskategorien für Skipass
export type AgeCategory = 'adult' | 'youthUntil16' | 'childUntil6';

// Price structure
export interface PriceByMembership {
    member: number;
    nonMember: number;
}
