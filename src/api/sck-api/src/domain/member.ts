/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

export type MemberStatus = 'active' | 'inactive';
export type MemberSource = 'online' | 'manual' | 'paper' | 'imported';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  birthday?: string;
  address?: string;
  isFamilyMembership: boolean;
  familyGroupId?: string;
  status: MemberStatus;
  source: MemberSource;
  applicationRegistrationId?: string;
  notes?: string;
  memberSince?: string;
  // Legacy membership number ("Nr") from the JSON importer - the primary
  // match key for re-running an import without creating duplicates.
  externalId?: string;
  // Decrypted on read (members-service.ts) - never stored in plain text,
  // see crypto-service.ts. Access is already fully gated by members:manage,
  // same as every other field here, so no separate masking layer.
  iban?: string;
  bic?: string;
  bankName?: string;
  accountHolder?: string;
  paymentMethod?: string;
}

export type MemberCreationParams = Omit<Member, 'id'>;

// One entry per requested year-count (Jubiläumsfunktion) - joinYear is
// years-count years before the reference date's year, members are every
// member whose memberSince falls in that calendar year (see
// members-service.ts's getAnniversaries()).
export interface AnniversaryGroup {
  years: number;
  joinYear: number;
  members: Member[];
}

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
