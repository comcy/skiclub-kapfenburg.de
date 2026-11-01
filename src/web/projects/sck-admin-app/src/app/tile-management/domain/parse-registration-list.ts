import { parseRegistrationRow, ParsedRegistrationRow } from './parse-registration-row';

export interface ParsedListRow {
    firstName: string;
    lastName: string;
    ageCategory: NonNullable<ParsedRegistrationRow['ageCategory']>;
    boardingId?: string;
    phone?: string;
    notes?: string;
}

export interface ParsedList {
    rows: ParsedListRow[];
    /** Zeilen ohne erkennbaren Namen (Kopf, Legende, Leerzeilen) */
    ignored: number;
}

// Tab-getrennt mit Anführungszeichen, wie Google Sheets kopiert: mehrzeilige Kopfzellen
// ("Kurs \nSki/Alpin") dürfen keine eigenen Zeilen ergeben.
const parseTsv = (text: string): string[][] => {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (quoted) {
            if (c === '"' && text[i + 1] === '"') {
                cell += '"';
                i++;
            } else if (c === '"') quoted = false;
            else cell += c;
        } else if (c === '"' && cell === '') quoted = true;
        else if (c === '\t') {
            row.push(cell);
            cell = '';
        } else if (c === '\n' || c === '\r') {
            if (c === '\r' && text[i + 1] === '\n') i++;
            row.push(cell);
            rows.push(row);
            row = [];
            cell = '';
        } else cell += c;
    }
    row.push(cell);
    rows.push(row);
    return rows;
};

// "Nachname, Vorname" oder "Nachname Vorname" (letztes Wort = Vorname). Ein vorangestelltes "MV" ist ein
// Gruppen-Kürzel und wandert in die Notiz.
const splitName = (cell: string): { firstName: string; lastName: string; tag?: string } | undefined => {
    let value = cell.trim();
    let tag: string | undefined;
    const prefix = /^(MV)\s+/i.exec(value);
    if (prefix) {
        tag = prefix[1].toUpperCase();
        value = value.slice(prefix[0].length);
    }
    const comma = /^([^,]+),\s*(.+)$/.exec(value);
    if (comma) return { lastName: comma[1].trim(), firstName: comma[2].trim(), tag };
    const words = value.split(/\s+/).filter(Boolean);
    if (words.length < 2) return undefined;
    return { firstName: words[words.length - 1], lastName: words.slice(0, -1).join(' '), tag };
};

// Eine ganze Teilnehmerliste (mehrere Zeilen aus dem Sheet). Der Name steht in der ersten Zelle, alles übrige
// (Alter, Telefon, Zustieg, Kürzel wie "EZ") wird nach Inhalt erkannt - siehe parseRegistrationRow.
export const parseRegistrationList = (text: string, boardings: { id: string; name: string }[] = []): ParsedList => {
    const rows: ParsedListRow[] = [];
    let ignored = 0;

    for (const cells of parseTsv(text)) {
        const first = (cells[0] ?? '').trim();
        if (!cells.some((c) => c.trim())) continue; // komplett leer
        const name = first && !/^name\s*,\s*vorname$/i.test(first) ? splitName(first) : undefined;
        if (!name) {
            ignored++;
            continue;
        }
        const rest = cells.slice(1);
        const parsed = parseRegistrationRow(rest.join('\t'), boardings);
        const tags = [name.tag, ...rest.map((c) => c.trim().toUpperCase()).filter((c) => c === 'EZ')].filter(Boolean);

        rows.push({
            firstName: name.firstName,
            lastName: name.lastName,
            ageCategory: parsed.ageCategory ?? 'adult',
            boardingId: parsed.boardingId,
            phone: parsed.phone,
            notes: tags.length ? tags.join(', ') : undefined,
        });
    }
    return { rows, ignored };
};
