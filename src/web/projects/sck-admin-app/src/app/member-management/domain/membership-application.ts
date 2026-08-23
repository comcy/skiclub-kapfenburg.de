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
}
