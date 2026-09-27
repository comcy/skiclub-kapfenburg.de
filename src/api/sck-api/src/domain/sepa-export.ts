/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

export interface SepaExportCandidate {
  id: string;
  firstName: string;
  lastName: string;
  familyGroupId?: string;
  hasIban: boolean;
}

export interface SepaTransactionPreview {
  memberId: string;
  payerName: string;
  ibanMasked: string;
  amount: number;
  mandateReference: string;
  mandateSignatureDate: string;
  familyGroupId?: string;
}

export interface SepaExportPreview {
  transactions: SepaTransactionPreview[];
  warnings: string[];
}

export type SepaSequenceType = 'FRST' | 'RCUR';

export interface SepaExportRequestBody {
  memberIds?: string[];
  executionDate?: string;
  sequenceType?: SepaSequenceType;
}
