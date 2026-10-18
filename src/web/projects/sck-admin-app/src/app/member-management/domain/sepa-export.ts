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
