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
    memberId?: string;
    boardingId?: string;
    boardingName?: string;
    ageCategory: RegistrationAgeCategory;
    isMember: boolean;
    status: RegistrationStatus;
    source: RegistrationSource;
    notes?: string;
    orderIndex: number;
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

// memberId/isMember are always recomputed server-side from email - never
// sent by the client, see trip-registrations-service.ts on the API side.
// confirmationMailSent is likewise always server-derived - never sent by
// the client (see the editor's onSave()).
export type TripRegistrationCreationParams = Omit<
    TripRegistration,
    'id' | 'tileId' | 'memberId' | 'isMember' | 'boardingName' | 'confirmationMailSent'
>;
