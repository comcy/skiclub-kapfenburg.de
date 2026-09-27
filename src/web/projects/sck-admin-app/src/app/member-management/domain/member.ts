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
    // Year-thresholds (e.g. [25, 40]) already honored at a JHV - only ever
    // set via MembersDataService.markHonored(), never through a normal save.
    honoredYears?: number[];
}

export type MemberCreationParams = Omit<Member, 'id'>;

// One entry per requested year-count (Jubiläumsfunktion) - members are
// everyone who has been in *at least* that long as of the reference date
// and hasn't been marked honored for this specific year-count yet - see
// members-service.ts's getAnniversaries() on the backend.
export interface AnniversaryGroup {
    years: number;
    cutoffYear: number;
    members: Member[];
}
