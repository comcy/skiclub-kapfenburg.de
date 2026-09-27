export type RegistrationAgeCategory = 'adult' | 'youthUntil16' | 'childUntil6';
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
    ageCategory: RegistrationAgeCategory;
    isMember: boolean;
    // What the participant themselves checked on the public form's member
    // checkbox - server-only, immutable after creation (see the API's
    // TripRegistrationCreationParams comment). Used to flag a mismatch
    // against the verified isMember below (claimed member pricing without
    // actually matching a member record).
    selfReportedIsMember: boolean;
    status: RegistrationStatus;
    source: RegistrationSource;
    notes?: string;
    orderIndex: number;
    // Admin email who created the row - server-only, set once at creation
    // (see the API), never editable afterwards.
    enteredBy?: string;
    // Admin-Buchhaltung, wie course-registration.ts's 'paid' - über den
    // Editor/das PUT setzbar.
    transferredToExternalList: boolean;
    // Server-only: nur nach erfolgreichem Mailversand serverseitig gesetzt,
    // nie über ein PUT vom Client editierbar - siehe die Omit unten.
    confirmationMailSent: boolean;
    // Eigene Auswahl des Anmelders (Formular) - server-seitig persistiert
    // (siehe der Plan). Required (nicht optional), damit ein Editor-PUT, das
    // diese Felder vergisst, hier einen Compile-Fehler auslöst statt die
    // Werte des Registrierenden stillschweigend zurückzusetzen.
    busOnly: boolean;
    snowshoes: boolean;
    courseRequested: boolean;
    level?: string;
}

// memberId is always recomputed server-side from email - never sent by the
// client. confirmationMailSent/enteredBy/selfReportedIsMember are likewise
// always server-derived/immutable - never sent by the client (see the
// editor's onSave()). isMember DOES round-trip through this type: the API
// only trusts it on an update (PUT), letting the editor correct a case the
// automatic email match got wrong - see trip-registrations-service.ts.
export type TripRegistrationCreationParams = Omit<
    TripRegistration,
    'id' | 'tileId' | 'memberId' | 'boardingName' | 'confirmationMailSent' | 'enteredBy' | 'selfReportedIsMember'
>;
