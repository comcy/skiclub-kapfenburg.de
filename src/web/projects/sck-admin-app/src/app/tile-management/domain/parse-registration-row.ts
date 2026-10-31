export interface ParsedRegistrationRow {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    /** ISO (yyyy-mm-dd), passend für <input type="date"> */
    birthday?: string;
    boardingId?: string;
    sportType?: 'Ski Alpin' | 'Snowboard';
}

const BIRTHDAY = /^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s*\(\d+\))?$/; // "24.12.1983 (42)"
const TIMESTAMP = /^\d{1,2}\.\d{1,2}\.\d{4},\s*\d{1,2}:\d{2}/; // "31.10.2026, 16:06"
const PHONE = /^\+?[\d\s/()-]{6,}$/;

const normalize = (value: string): string =>
    value
        .toLowerCase()
        .replace(/\(.*?\)/g, '')
        .replace(/\s+/g, ' ')
        .trim();

// Eine aus der Anmelde-Tabelle kopierte Zeile (tab-getrennt) wird anhand des Zelleninhalts den Feldern
// zugeordnet, nicht anhand fester Spaltenpositionen - die Tabelle kann zusätzliche/leere Spalten haben.
// Die ersten zwei nicht erkannten Zellen sind Vorname und Nachname; alles übrige (Ausfahrt, Ausfahrtsdatum,
// Zeitstempel, ...) wird ignoriert, weil die Ausfahrt/der Kurs durch den Kontext schon feststeht.
export const parseRegistrationRow = (
    text: string,
    boardings: { id: string; name: string }[] = [],
): ParsedRegistrationRow => {
    const result: ParsedRegistrationRow = {};
    const names: string[] = [];
    const cells = text
        .replace(/\r?\n$/, '')
        .split('\t')
        .map((c) => c.trim())
        .filter(Boolean);

    for (const cell of cells) {
        const date = BIRTHDAY.exec(cell);
        const lower = cell.toLowerCase();
        const boarding = boardings.find((b) => {
            const a = normalize(cell);
            const n = normalize(b.name);
            return a.length >= 4 && n.length >= 4 && (a === n || a.startsWith(n) || n.startsWith(a));
        });

        if (cell.includes('@')) result.email ??= cell;
        else if (date) result.birthday ??= `${date[3]}-${date[2].padStart(2, '0')}-${date[1].padStart(2, '0')}`;
        else if (TIMESTAMP.test(cell)) continue;
        else if (PHONE.test(cell)) result.phone ??= cell;
        else if (lower === 'ski alpin' || lower === 'alpin') result.sportType ??= 'Ski Alpin';
        else if (lower === 'snowboard' || lower === 'board') result.sportType ??= 'Snowboard';
        else if (boarding) result.boardingId ??= boarding.id;
        else names.push(cell);
    }

    [result.firstName, result.lastName] = [names[0], names[1]];
    return result;
};
