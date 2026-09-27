/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Same three values as trips-lib's client-side AgeCategory (trip-base.ts) -
// duplicated rather than imported, matching the existing sck-api convention
// of not depending on trips-lib's types (see domain/tile.ts's tripConfig
// comment).
export type AgeCategory = 'adult' | 'youthUntil16' | 'childUntil6';
export type RegistrationStatus = 'confirmed' | 'waitlist' | 'cancelled';
export type RegistrationSource = 'manual' | 'phone' | 'paper' | 'sheet-import';

export interface TripRegistration {
  id: string;
  tileId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthday?: string;
  memberId?: string;
  boardingId?: string;
  boardingName?: string;
  ageCategory: AgeCategory;
  isMember: boolean;
  // What the participant themselves checked on the public form - kept
  // separate from isMember (server-verified via email, see resolveMember)
  // so admins can spot a mismatch (claimed member pricing but isMember is
  // false) and follow up, rather than silently trusting either signal.
  selfReportedIsMember: boolean;
  status: RegistrationStatus;
  source: RegistrationSource;
  notes?: string;
  orderIndex: number;
  // Admin email who created the row - set once server-side from the
  // authenticated session (see the controller), never client-supplied.
  // undefined for public self-registrations (no admin author) - same
  // pattern as course-registration.ts.
  enteredBy?: string;
  // Admin-Buchhaltung, wie course-registration.ts's 'paid' - über den
  // Editor/das PUT setzbar.
  transferredToExternalList: boolean;
  // Server-only: erst nach erfolgreichem sendMail() gesetzt (siehe
  // trip-registrations-service.ts's markConfirmationMailSent), nie über ein
  // PUT vom Client trustbar - siehe updateRegistration's Ausschluss.
  confirmationMailSent: boolean;
  // Eigene Auswahl des Anmelders (Formular) - server-seitig persistiert, um
  // die Bestätigungsmail-Preistabelle jederzeit nachträglich rendern zu
  // können, ohne die Berechnung clientseitig zu duplizieren (siehe
  // trip-pricing-service.ts).
  busOnly: boolean;
  snowshoes: boolean;
  courseRequested: boolean;
  level?: string;
}

// memberId is always recomputed server-side from email (see
// trip-registrations-service.ts) - never accepted from the client.
// confirmationMailSent/enteredBy are likewise always server-derived (see
// the controller's post-creation sendMail flow / createRegistration's
// separate enteredBy parameter). isMember stays part of this type (unlike
// the fields above) but is handled asymmetrically: createRegistration
// always ignores it and derives it fresh from email (a safe default for a
// brand-new row, public or admin-typed), while updateRegistration trusts
// it as-is - the admin editor's own way to correct a case the automatic
// email match got wrong (see registration-editor.component.ts).
export type TripRegistrationCreationParams = Omit<
  TripRegistration,
  'id' | 'tileId' | 'memberId' | 'boardingName' | 'confirmationMailSent' | 'enteredBy'
>;

// One participant as submitted by the PUBLIC registration form (see
// createPublicRegistrations in trip-registrations-service.ts). ageCategory
// is derived server-side from birthday, not accepted from the client -
// status/source/orderIndex are computed entirely server-side too. busOnly/
// snowshoes/courseRequested/level ARE accepted as-is - they're the
// registrant's own form choices, needed for the price table in the
// confirmation mail (see trip-registration-mail-service.ts).
export interface PublicParticipantInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthday?: string;
  boarding?: string;
  busOnly?: boolean;
  snowshoes?: boolean;
  courseRequested?: boolean;
  level?: string;
  // What the participant checked on the public form's own (client-side-only,
  // for the live price preview) member checkbox - stored as-is into
  // selfReportedIsMember, never used to derive the real isMember (that stays
  // email-matched, see resolveMember).
  isMember?: boolean;
}

export interface PublicRegistrationResult {
  status: RegistrationStatus;
  waitlistPosition?: number;
  waitlistCount?: number;
}

// Internal return of createPublicRegistrations (service layer only) - adds
// the created rows' ids so the controller can fetch them back for the
// confirmation mail's participant list, without leaking ids into the public
// HTTP response (PublicRegistrationResult stays the wire contract).
export interface PublicRegistrationCreateResult extends PublicRegistrationResult {
  registrationIds: string[];
}
