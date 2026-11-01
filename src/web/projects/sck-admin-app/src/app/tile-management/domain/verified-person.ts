export interface VerifiedPerson {
    id: string;
    firstName: string;
    lastName: string;
    birthday: string | null;
    memberId: string | null;
    createdAt: string;
    revokedAt: string | null;
}
