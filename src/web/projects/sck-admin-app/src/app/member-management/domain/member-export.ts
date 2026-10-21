import { Member } from './member';

export type ExportFormat = 'text' | 'tsv' | 'csv';
export type ExportGroup = 'Stammdaten' | 'Kontakt' | 'Mitgliedschaft' | 'Bankdaten';

export interface ExportField {
    key: string;
    label: string;
    group: ExportGroup;
    // Beim Oeffnen vorausgewaehlt - Bankdaten und interne Felder bewusst nicht.
    defaultOn: boolean;
    value: (member: Member) => string;
}

// dd.MM.yyyy aus ISO (YYYY-MM-DD...), alles andere unveraendert (Altdaten mit Freitext).
const formatDate = (value?: string): string => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '');
    return m ? `${m[3]}.${m[2]}.${m[1]}` : (value ?? '');
};

// Vierergruppen, wie in der Antragsliste - leichter zu lesen und abzutippen.
const formatIban = (iban?: string): string =>
    (iban ?? '')
        .replace(/\s+/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();

const SOURCE_LABEL: Record<Member['source'], string> = {
    online: 'Online-Antrag',
    manual: 'Manuell',
    paper: 'Papier',
    imported: 'Import',
};

export const MEMBER_EXPORT_FIELDS: ExportField[] = [
    {
        key: 'externalId',
        label: 'Mitgliedsnr.',
        group: 'Stammdaten',
        defaultOn: true,
        value: (m) => m.externalId ?? '',
    },
    { key: 'lastName', label: 'Nachname', group: 'Stammdaten', defaultOn: true, value: (m) => m.lastName },
    { key: 'firstName', label: 'Vorname', group: 'Stammdaten', defaultOn: true, value: (m) => m.firstName },
    {
        key: 'birthday',
        label: 'Geburtsdatum',
        group: 'Stammdaten',
        defaultOn: true,
        value: (m) => formatDate(m.birthday),
    },
    { key: 'address', label: 'Adresse', group: 'Kontakt', defaultOn: true, value: (m) => m.address ?? '' },
    { key: 'email', label: 'E-Mail', group: 'Kontakt', defaultOn: true, value: (m) => m.email ?? '' },
    { key: 'phone', label: 'Telefon', group: 'Kontakt', defaultOn: true, value: (m) => m.phone ?? '' },
    { key: 'mobile', label: 'Mobil', group: 'Kontakt', defaultOn: false, value: (m) => m.mobile ?? '' },
    {
        key: 'status',
        label: 'Status',
        group: 'Mitgliedschaft',
        defaultOn: true,
        value: (m) => (m.status === 'active' ? 'Aktiv' : 'Inaktiv'),
    },
    {
        key: 'memberSince',
        label: 'Mitglied seit',
        group: 'Mitgliedschaft',
        defaultOn: true,
        value: (m) => formatDate(m.memberSince),
    },
    {
        key: 'family',
        label: 'Familienmitgliedschaft',
        group: 'Mitgliedschaft',
        defaultOn: false,
        value: (m) => (m.isFamilyMembership ? 'Ja' : 'Nein'),
    },
    {
        key: 'source',
        label: 'Quelle',
        group: 'Mitgliedschaft',
        defaultOn: false,
        value: (m) => SOURCE_LABEL[m.source] ?? m.source,
    },
    {
        key: 'notes',
        label: 'Notizen',
        group: 'Mitgliedschaft',
        defaultOn: false,
        value: (m) => (m.notes ?? '').replace(/\s*\n\s*/g, ' '),
    },
    {
        key: 'accountHolder',
        label: 'Kontoinhaber',
        group: 'Bankdaten',
        defaultOn: false,
        value: (m) => m.accountHolder ?? '',
    },
    { key: 'iban', label: 'IBAN', group: 'Bankdaten', defaultOn: false, value: (m) => formatIban(m.iban) },
    { key: 'bic', label: 'BIC', group: 'Bankdaten', defaultOn: false, value: (m) => m.bic ?? '' },
    { key: 'bankName', label: 'Bank', group: 'Bankdaten', defaultOn: false, value: (m) => m.bankName ?? '' },
    {
        key: 'paymentMethod',
        label: 'Zahlungsbedingung',
        group: 'Bankdaten',
        defaultOn: false,
        value: (m) => m.paymentMethod ?? '',
    },
];

export const defaultExportKeys = (): string[] => MEMBER_EXPORT_FIELDS.filter((f) => f.defaultOn).map((f) => f.key);

// CSV: Semikolon (deutsches Excel), Anfuehrungszeichen verdoppelt, Felder mit
// Trennzeichen/Zeilenumbruch/Anfuehrungszeichen in Anfuehrungszeichen.
const csvCell = (value: string): string => (/[";\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

// Tabulatoren/Zeilenumbrueche im Wert wuerden Spalten/Zeilen verschieben.
const tsvCell = (value: string): string => value.replace(/[\t\r\n]+/g, ' ');

// Einheitlicher Export: 'text' = je Mitglied ein Block "Label: Wert" (leere Felder
// entfallen), 'tsv' = Tabelle zum Einfuegen in Excel/Sheets, 'csv' = Datei fuer Excel.
export const buildMemberExport = (
    members: Member[],
    keys: string[],
    format: ExportFormat,
    withHeader = true,
): string => {
    const fields = MEMBER_EXPORT_FIELDS.filter((f) => keys.includes(f.key));
    if (!fields.length || !members.length) return '';

    if (format === 'text') {
        return members
            .map((member) =>
                fields
                    .map((f) => [f.label, f.value(member)] as const)
                    .filter(([, value]) => value !== '')
                    .map(([label, value]) => `${label}: ${value}`)
                    .join('\n'),
            )
            .join('\n\n');
    }

    const cell = format === 'csv' ? csvCell : tsvCell;
    const separator = format === 'csv' ? ';' : '\t';
    const rows = members.map((member) => fields.map((f) => cell(f.value(member))).join(separator));
    return [...(withHeader ? [fields.map((f) => cell(f.label)).join(separator)] : []), ...rows].join('\n');
};
