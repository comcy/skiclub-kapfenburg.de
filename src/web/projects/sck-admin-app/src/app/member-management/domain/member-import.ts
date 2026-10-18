import { Member, MemberCreationParams } from './member';

export interface MemberImportDiffField {
    field: string;
    label: string;
    existing: unknown;
    incoming: unknown;
}

export interface MemberImportCollision {
    memberId: string;
    mapped: MemberCreationParams;
    existing: Member;
    diffFields: MemberImportDiffField[];
}

export interface MemberImportPreview {
    importId: string;
    neu: MemberCreationParams[];
    identisch: number;
    kollisionen: MemberImportCollision[];
}

export interface MemberImportCollisionOverride {
    memberId: string;
    fields: Partial<MemberCreationParams>;
}

export interface MemberImportApplyResult {
    created: number;
    updated: number;
}
