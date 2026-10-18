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
  // Year-thresholds (e.g. [25, 40]) this member has already been honored
  // for at a JHV - see getAnniversaries()/markHonored() below. Optional
  // (defaults to []) so every existing MemberCreationParams call site
  // doesn't need to know about it - only markHonored() ever sets it.
  honoredYears?: number[];
}

export type MemberCreationParams = Omit<Member, 'id'>;

// One entry per requested year-count (Jubiläumsfunktion) - cutoffYear is
// the reference date's year minus that year-count; members are everyone
// who has been in *at least* that long (memberSince year <= cutoffYear)
// and hasn't been marked honored for this specific year-count yet - a
// member entitled to both 25 and 40 years, honored only for 25, still
// shows up under a 40-years query.
export interface AnniversaryGroup {
  years: number;
  cutoffYear: number;
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
