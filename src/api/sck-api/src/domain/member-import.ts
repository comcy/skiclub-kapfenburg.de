/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Member, MemberCreationParams } from './member.js';

// Shape of one record in the JSON file an admin uploads - matches the
// legacy export this club's previous membership-management tool produces.
export interface MemberImportRecord {
  Nr?: string;
  Name?: string;
  Adresse_Raw?: string;
  Adresse?: string;
  Eintrittsdatum?: string;
  Kommunikation?: {
    'Tel 1'?: string;
    'Tel 2'?: string;
    Mobil?: string;
    'E-Mail'?: string;
  };
  Bankdaten?: {
    Bank?: string;
    BIC?: string;
    IBAN?: string;
    Kontoinhaber?: string;
  };
  Zahlungsbedingung?: string;
}

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

export interface MemberImportApplyRequest {
  importId: string;
  collisionOverrides: MemberImportCollisionOverride[];
}

export interface MemberImportApplyResult {
  created: number;
  updated: number;
}
