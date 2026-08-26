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
    // Legacy membership number ("Nr") from the JSON importer.
    externalId?: string;
    // Decrypted server-side (members-service.ts) - never stored in plain
    // text, access is already fully gated by members:manage.
    iban?: string;
    bic?: string;
    bankName?: string;
    accountHolder?: string;
    paymentMethod?: string;
}

export type MemberCreationParams = Omit<Member, 'id'>;
