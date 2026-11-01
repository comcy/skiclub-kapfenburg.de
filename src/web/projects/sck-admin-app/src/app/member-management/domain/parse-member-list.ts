// Parst die Mitglieder-/Kontaktliste des Altsystems (CSV oder aus Excel/Sheets kopiert) in die Datensätze
// des bestehenden JSON-Imports. Pro Mitglied ein Block aus mehreren Zeilen: Spalte 1 = Nr + (nur in der
// ersten Zeile) mehrzeilige Adresse "Name\nStraße\n\nD-PLZ Ort"; alle anderen Daten stehen als
// "Label: Wert"-Paare in beliebigen Spalten derselben Zeilen (Label endet auf ":", Wert = nächste nicht
// leere Zelle, die kein Label ist).

export interface ParsedMemberRecord {
    Nr?: string;
    Name?: string;
    Adresse?: string;
    Eintrittsdatum?: string;
    Kommunikation: { 'Tel 1'?: string; 'Tel 2'?: string; Mobil?: string; 'E-Mail'?: string };
    Bankdaten: { Bank?: string; BIC?: string; IBAN?: string; Kontoinhaber?: string };
    Zahlungsbedingung?: string;
}

// CSV/TSV mit Anführungszeichen (auch Zeilenumbrüche in Zellen). Trennzeichen: Tab, wenn vorhanden, sonst Komma.
export const parseDelimited = (text: string): string[][] => {
    const delimiter = text.split('\n', 1)[0].includes('\t') ? '\t' : ',';
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (quoted) {
            if (ch === '"' && text[i + 1] === '"') {
                cell += '"';
                i++;
            } else if (ch === '"') quoted = false;
            else cell += ch;
        } else if (ch === '"') quoted = true;
        else if (ch === delimiter) {
            row.push(cell);
            cell = '';
        } else if (ch === '\n' || ch === '\r') {
            if (ch === '\r' && text[i + 1] === '\n') i++;
            row.push(cell);
            rows.push(row);
            row = [];
            cell = '';
        } else cell += ch;
    }
    if (cell || row.length) {
        row.push(cell);
        rows.push(row);
    }
    return rows;
};

const LABELS: Record<string, (r: ParsedMemberRecord, v: string) => void> = {
    'tel. 1:': (r, v) => (r.Kommunikation['Tel 1'] = v),
    'tel. 2:': (r, v) => (r.Kommunikation['Tel 2'] = v),
    'mobil:': (r, v) => (r.Kommunikation.Mobil = v),
    'e-mail:': (r, v) => (r.Kommunikation['E-Mail'] = v),
    'eintrittsdatum:': (r, v) => (r.Eintrittsdatum = v),
    'zahlungsbedingung/-art:': (r, v) => (r.Zahlungsbedingung = v),
    'bank:': (r, v) => (r.Bankdaten.Bank = v),
    'blz / bic:': (r, v) => (r.Bankdaten.BIC = v),
    'kontonummer / iban:': (r, v) => (r.Bankdaten.IBAN = v),
    'kontoinhaber:': (r, v) => (r.Bankdaten.Kontoinhaber = v),
};

const isLabel = (cell: string): boolean => cell.trim().endsWith(':');

// "Name\nStraße\n\nD-12345 Ort" -> Name + "Straße, D-12345 Ort"
const parseAddressCell = (cell: string): { name?: string; address?: string } => {
    const lines = cell
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
    return { name: lines[0], address: lines.length > 1 ? lines.slice(1).join(', ') : undefined };
};

export const parseMemberList = (text: string): ParsedMemberRecord[] => {
    const records: ParsedMemberRecord[] = [];
    let current: ParsedMemberRecord | null = null;
    for (const row of parseDelimited(text)) {
        const nr = row[0]?.trim() ?? '';
        if (/^\d+$/.test(nr)) {
            current = { Nr: nr, Kommunikation: {}, Bankdaten: {} };
            const { name, address } = parseAddressCell(row[1] ?? '');
            current.Name = name;
            current.Adresse = address;
            records.push(current);
        }
        if (!current) continue;
        row.forEach((cell, i) => {
            const label = cell.trim().toLowerCase();
            const apply = LABELS[label];
            if (!apply) return;
            const value = row.slice(i + 1).find((c) => c.trim() !== '');
            if (value !== undefined && !isLabel(value)) apply(current!, value.trim());
        });
    }
    return records.filter((r) => r.Name);
};
