/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

export type MemberStatus = 'active' | 'inactive';
export type MemberSource = 'online' | 'manual' | 'paper';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthday?: string;
  address?: string;
  isFamilyMembership: boolean;
  familyGroupId?: string;
  status: MemberStatus;
  source: MemberSource;
  applicationRegistrationId?: string;
  notes?: string;
  memberSince?: string;
}

export type MemberCreationParams = Omit<Member, 'id'>;

// Rows from registrations.ndjson (type: 'membership-registration') that
// haven't been promoted into a `members` row yet - see members-service.ts's
// listMembershipApplications().
export interface MembershipApplication {
  registrationId: string;
  timestamp: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthday?: string;
  address?: string;
  isFamilyMembership?: boolean;
  familyMembers?: { firstName: string; lastName: string; birthday: string }[];
  // Double-Opt-in-Status (membership_confirmation_tokens) - siehe
  // membership-confirmation-service.ts. Ein Antrag wird erst nach
  // Bestätigung an den Vorstand gemeldet; das Admin-UI gated "Promote"
  // (Antrag zu members übernehmen) darauf.
  confirmed: boolean;
}
