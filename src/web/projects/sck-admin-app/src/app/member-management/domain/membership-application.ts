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
    // Beim Online-Antrag Pflicht (sonst kein Antrag) - die Datei wird unveraendert in die Liste gereicht.
    sepaMandateAccepted?: boolean;
    // Double-Opt-in-Status - siehe sck-api's membership-confirmation-service.ts.
    confirmed: boolean;
}
