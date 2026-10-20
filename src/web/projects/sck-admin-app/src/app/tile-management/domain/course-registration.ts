export type CourseRegistrationStatus = 'confirmed' | 'cancelled';
export type CourseRegistrationSource = 'manual' | 'sheet-import';

export interface CourseRegistration {
    id: string;
    tileId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    memberId?: string;
    birthday?: string;
    sportType?: string;
    level?: string;
    groupId?: string;
    isMember: boolean;
    // Was die Person im Formular angekreuzt hat - getrennt von isMember (per E-Mail
    // verifiziert bzw. vom Admin gesetzt), damit Abweichungen auffallen.
    selfReportedIsMember: boolean;
    status: CourseRegistrationStatus;
    source: CourseRegistrationSource;
    notes?: string;
    orderIndex: number;
    // Admin email who created the row, set server-side - undefined for
    // public self-registrations (no admin author).
    enteredBy?: string;
    paid: boolean;
    // Admin-Buchhaltung, wie 'paid' - über den Editor/das PUT setzbar.
    transferredToExternalList: boolean;
    // Server-only: nur nach erfolgreichem Mailversand serverseitig gesetzt,
    // nie über ein PUT vom Client editierbar - siehe die Omit unten.
    confirmationMailSent: boolean;
    // Zeitpunkt der Anmeldung (ISO) - fuer die Neu-Markierung.
    createdAt?: string;
}

// memberId is always recomputed server-side from email - never sent by the
// client. isMember IS sent (Admin-Editor): beim Anlegen leitet die API es aus
// der E-Mail ab, beim Aendern uebernimmt sie den Wert - so korrigiert der Admin,
// was der automatische Abgleich nicht erkennt. enteredBy is always
// server-derived from the session, confirmationMailSent likewise (see the
// editor's onSave()).
export type CourseRegistrationCreationParams = Omit<
    CourseRegistration,
    'id' | 'tileId' | 'memberId' | 'enteredBy' | 'confirmationMailSent' | 'createdAt'
>;
