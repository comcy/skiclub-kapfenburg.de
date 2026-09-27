/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Member } from '../domain/member.js';
import { MEMBERSHIP_FEE_SETTING_KEY, MembershipFeeSettings, SEPA_CREDITOR_SETTING_KEY, SepaCreditorSettings } from '../domain/settings.js';
import { SepaExportCandidate, SepaExportPreview, SepaSequenceType } from '../domain/sepa-export.js';
import { getMember, listActiveMembers } from './members-service.js';
import { getSetting } from './settings-service.js';

const EMPTY_FEES: MembershipFeeSettings = { individual: 0, family: 0 };

export const listExportCandidates = (): SepaExportCandidate[] =>
  listActiveMembers().map((member) => ({
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    familyGroupId: member.familyGroupId,
    hasIban: !!member.iban,
  }));

const maskIban = (iban: string): string => {
  const clean = iban.replace(/\s+/g, '');
  return clean.length <= 4 ? clean : `${clean.slice(0, 4)} •••• •••• ${clean.slice(-4)}`;
};

interface ComputedTransaction {
  member: Member;
  amount: number;
  familyGroupId?: string;
}

// Groups the selected members by familyGroupId - one transaction per group
// (the family fee, billed to the first member in the group with an IBAN on
// file), everyone without a familyGroupId is billed individually at the
// individual rate. This default rule is a placeholder until the exact
// family-billing convention is confirmed against the old system (see the
// plan) - adjustable here without touching the XML generation below.
const computeTransactions = (
  members: Member[],
  fees: MembershipFeeSettings,
): { transactions: ComputedTransaction[]; warnings: string[] } => {
  const warnings: string[] = [];
  const transactions: ComputedTransaction[] = [];
  const byFamily = new Map<string, Member[]>();

  for (const member of members) {
    if (!member.familyGroupId) {
      if (!member.iban) {
        warnings.push(`${member.firstName} ${member.lastName} hat keine IBAN hinterlegt - übersprungen.`);
        continue;
      }
      transactions.push({ member, amount: fees.individual });
      continue;
    }
    const group = byFamily.get(member.familyGroupId) ?? [];
    group.push(member);
    byFamily.set(member.familyGroupId, group);
  }

  for (const [familyGroupId, group] of byFamily) {
    const payer = group.find((member) => member.iban);
    if (!payer) {
      warnings.push(`Familie "${familyGroupId}" hat keine IBAN hinterlegt - übersprungen.`);
      continue;
    }
    transactions.push({ member: payer, amount: fees.family, familyGroupId });
  }

  return { transactions, warnings };
};

const resolveMembers = (memberIds: string[]): Member[] =>
  memberIds.map((id) => getMember(id)).filter((member): member is Member => !!member);

export const computePreview = (memberIds: string[]): SepaExportPreview => {
  const fees = getSetting<MembershipFeeSettings>(MEMBERSHIP_FEE_SETTING_KEY) ?? EMPTY_FEES;
  const { transactions, warnings } = computeTransactions(resolveMembers(memberIds), fees);

  return {
    transactions: transactions.map((t) => ({
      memberId: t.member.id,
      payerName: `${t.member.firstName} ${t.member.lastName}`,
      ibanMasked: t.member.iban ? maskIban(t.member.iban) : '',
      amount: t.amount,
      // Mandatsreferenz/Unterschriftsdatum werden bewusst nicht als eigene
      // Spalten gepflegt - die member.id ist bereits eine stabile,
      // eindeutige Kennung, memberSince ist das Datum, an dem die
      // Mitgliedschaft inkl. SEPA-Mandat unterschrieben wurde.
      mandateReference: t.member.id,
      mandateSignatureDate: t.member.memberSince ?? '',
      familyGroupId: t.familyGroupId,
    })),
    warnings,
  };
};

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const formatAmount = (amount: number): string => amount.toFixed(2);
const isoDateOnly = (value: string): string => value.slice(0, 10);
const cleanIban = (iban: string): string => iban.replace(/\s+/g, '').toUpperCase();

const debtorAgentXml = (bic: string | undefined): string =>
  bic
    ? `<DbtrAgt><FinInstnId><BIC>${escapeXml(bic)}</BIC></FinInstnId></DbtrAgt>`
    : `<DbtrAgt><FinInstnId><Othr><Id>NOTPROVIDED</Id></Othr></FinInstnId></DbtrAgt>`;

const transactionXml = (t: ComputedTransaction, executionDate: string): string => {
  const name = `${t.member.firstName} ${t.member.lastName}`;
  const year = isoDateOnly(executionDate).slice(0, 4);
  const purpose = escapeXml(
    t.familyGroupId ? `Mitgliedsbeitrag ${year} (Familie) - ${name}` : `Mitgliedsbeitrag ${year} - ${name}`,
  );

  return `
      <DrctDbtTxInf>
        <PmtId>
          <EndToEndId>${escapeXml(t.member.id)}</EndToEndId>
        </PmtId>
        <InstdAmt Ccy="EUR">${formatAmount(t.amount)}</InstdAmt>
        <DrctDbtTx>
          <MndtRltdInf>
            <MndtId>${escapeXml(t.member.id)}</MndtId>
            <DtOfSgntr>${isoDateOnly(t.member.memberSince || executionDate)}</DtOfSgntr>
          </MndtRltdInf>
        </DrctDbtTx>
        ${debtorAgentXml(t.member.bic)}
        <Dbtr>
          <Nm>${escapeXml(t.member.accountHolder || name)}</Nm>
        </Dbtr>
        <DbtrAcct>
          <Id><IBAN>${cleanIban(t.member.iban ?? '')}</IBAN></Id>
        </DbtrAcct>
        <RmtInf>
          <Ustrd>${purpose}</Ustrd>
        </RmtInf>
      </DrctDbtTxInf>`;
};

// Hand-rolled pain.008.001.02 (SEPA-Sammellastschrift) - the schema is
// small and fixed, not worth a new XML-library dependency for. Structure
// eyeballed against the ISO 20022 spec; verify with the bank's own upload
// tool before actually collecting real money (see the plan).
export const generatePain008 = (memberIds: string[], executionDate: string, sequenceType: SepaSequenceType): string => {
  const creditor = getSetting<SepaCreditorSettings>(SEPA_CREDITOR_SETTING_KEY);
  if (!creditor?.creditorId || !creditor.iban) {
    throw new Error('Bitte zuerst Gläubiger-ID und Vereinskonto unter Einstellungen hinterlegen.');
  }
  const fees = getSetting<MembershipFeeSettings>(MEMBERSHIP_FEE_SETTING_KEY) ?? EMPTY_FEES;
  const { transactions } = computeTransactions(resolveMembers(memberIds), fees);
  if (transactions.length === 0) {
    throw new Error('Keine gültigen Lastschriften zu exportieren (fehlende IBANs?).');
  }

  const msgId = `SCK-${Date.now()}`;
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const creditorAgentXml = creditor.bic
    ? `\n      <CdtrAgt><FinInstnId><BIC>${escapeXml(creditor.bic)}</BIC></FinInstnId></CdtrAgt>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.008.001.02" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <CstmrDrctDbtInitn>
    <GrpHdr>
      <MsgId>${msgId}</MsgId>
      <CreDtTm>${new Date().toISOString()}</CreDtTm>
      <NbOfTxs>${transactions.length}</NbOfTxs>
      <CtrlSum>${formatAmount(totalAmount)}</CtrlSum>
      <InitgPty>
        <Nm>${escapeXml(creditor.creditorName)}</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>${msgId}-1</PmtInfId>
      <PmtMtd>DD</PmtMtd>
      <NbOfTxs>${transactions.length}</NbOfTxs>
      <CtrlSum>${formatAmount(totalAmount)}</CtrlSum>
      <PmtTpInf>
        <SvcLvl><Cd>SEPA</Cd></SvcLvl>
        <LclInstrm><Cd>CORE</Cd></LclInstrm>
        <SeqTp>${sequenceType}</SeqTp>
      </PmtTpInf>
      <ReqdColltnDt>${isoDateOnly(executionDate)}</ReqdColltnDt>
      <Cdtr>
        <Nm>${escapeXml(creditor.creditorName)}</Nm>
      </Cdtr>
      <CdtrAcct>
        <Id><IBAN>${cleanIban(creditor.iban)}</IBAN></Id>
      </CdtrAcct>${creditorAgentXml}
      <CdtrSchmeId>
        <Id>
          <PrvtId>
            <Othr>
              <Id>${escapeXml(creditor.creditorId)}</Id>
              <SchmeNm><Prtry>SEPA</Prtry></SchmeNm>
            </Othr>
          </PrvtId>
        </Id>
      </CdtrSchmeId>${transactions.map((t) => transactionXml(t, executionDate)).join('')}
    </PmtInf>
  </CstmrDrctDbtInitn>
</Document>`;
};
