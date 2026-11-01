import { Member } from './member';

// Kontoinhaber ist, wessen Vorname im Kontoinhaber-Feld steht (der Nachname allein trifft die ganze Familie).
const isAccountHolder = (m: Member): boolean => {
    const holder = (m.accountHolder ?? '').toLowerCase();
    return !!holder && !!m.firstName.trim() && holder.includes(m.firstName.trim().toLowerCase());
};

// Sortierung für den Hauptanmelder einer Familie (der erste gewinnt): Kontoinhaber, dann wer eine IBAN hat,
// dann wer eine E-Mail hat, dann länger Mitglied, dann älter, dann alphabetisch.
export const familyHeadOrder = (a: Member, b: Member): number =>
    Number(isAccountHolder(b)) - Number(isAccountHolder(a)) ||
    Number(!!b.iban) - Number(!!a.iban) ||
    Number(!!b.email) - Number(!!a.email) ||
    (a.memberSince ?? '9999').localeCompare(b.memberSince ?? '9999') ||
    (a.birthday ?? '9999').localeCompare(b.birthday ?? '9999') ||
    `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
