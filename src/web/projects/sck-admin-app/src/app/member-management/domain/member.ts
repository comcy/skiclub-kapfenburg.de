export type MemberStatus = 'active' | 'inactive';
export type MemberSource = 'online' | 'manual' | 'paper';

export interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    birthday?: string;
    address?: string;
    isFamilyMembership: boolean;
    familyGroupId?: string;
    status: MemberStatus;
    source: MemberSource;
    applicationRegistrationId?: string;
    notes?: string;
    memberSince?: string;
}

export type MemberCreationParams = Omit<Member, 'id'>;
