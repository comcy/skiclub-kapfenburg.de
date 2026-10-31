export interface ParsedRegistrationRow {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    /** ISO (yyyy-mm-dd), passend für <input type="date"> */
    birthday?: string;
    boardingId?: string;
    /** nur wenn die Zeile ein Alter, aber kein Geburtsdatum enthält */
    ageCategory?: 'adult' | 'youthUntil16' | 'childUntil6';
    sportType?: 'Ski Alpin' | 'Snowboard';
}

const BIRTHDAY = /^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s*\(\d+\))?$/; // "24.12.1983 (42)"
const TIMESTAMP = /^\d{1,2}\.\d{1,2}\.\d{4},\s*\d{1,2}:\d{2}/; // "31.10.2026, 16:06"
const AGE = /^\d{1,3}$/; // "37" (Spalte Alter der Sheet-Zeile)
const PRICE = /^\d+(?:[.,]\d{1,2})?\s*€$|^\d+[.,]\d{2}$/; // "100,00 €"
const FLAG = /^(true|false|ja|nein)$/i; // Checkbox-/Ja-Nein-Spalten
const COMMA_NAME = /^([^,\d@]+),\s*([^,\d@]+)$/; // "Neukamm, Peter" = Nachname, Vorname
const PHONE = /^\+?[\d\s/()-]{6,}$/;

const normalize = (value: string): string =>
    value
        .toLowerCase()
        .replace(/\(.*?\)/g, '')
        .replace(/\s+/g, ' ')
        .trim();

const ageCategoryOf = (age: number): ParsedRegistrationRow['ageCategory'] =>
    age <= 6 ? 'childUntil6' : age <= 16 ? 'youthUntil16' : 'adult';

// Eine kopierte Zeile (tab-getrennt) wird anhand des Zelleninhalts den Feldern zugeordnet, nicht anhand fester
// Spaltenpositionen. Unterstützt beide Tabellen: die Anmelde-Tabelle (Vorname | Nachname | E-Mail | Telefon |
// Geburtsdatum (Alter) | Zustieg | Ausfahrt | ...) und die Sheet-Liste ("Nachname, Vorname" | ... | Alter |
// Telefon | ... | Preis | ... | Zustieg | eingetragen von). Namen: "Nachname, Vorname" in einer Zelle, sonst
// die ersten zwei nicht erkannten Zellen (Vorname, Nachname). Alles übrige (Ausfahrt, Datum, Zeitstempel, Preis,
// "eingetragen von", ...) wird ignoriert, weil Ausfahrt/Kurs durch den Kontext feststehen und der Preis berechnet wird.
export const parseRegistrationRow = (
    text: string,
    boardings: { id: string; name: string }[] = [],
): ParsedRegistrationRow => {
    const result: ParsedRegistrationRow = {};
    const names: string[] = [];
    let age: number | undefined;
    const cells = text
        .replace(/\r?\n$/, '')
        .split('\t')
        .map((c) => c.trim())
        .filter(Boolean);

    for (const cell of cells) {
        const date = BIRTHDAY.exec(cell);
        const commaName = COMMA_NAME.exec(cell);
        const lower = cell.toLowerCase();
        const a = normalize(cell);
        const matches = boardings.filter((b) => {
            const n = normalize(b.name);
            return a.length >= 4 && n.length >= 4 && (a === n || a.startsWith(n) || n.startsWith(a));
        });
        // exakter Treffer, sonst nur ein eindeutiger Anfangs-Treffer ("Hülen" -> "Hülen Bushaltestelle ...")
        const boarding =
            matches.find((b) => normalize(b.name) === a) ?? (matches.length === 1 ? matches[0] : undefined);

        if (cell.includes('@')) result.email ??= cell;
        else if (date) result.birthday ??= `${date[3]}-${date[2].padStart(2, '0')}-${date[1].padStart(2, '0')}`;
        else if (TIMESTAMP.test(cell) || PRICE.test(cell) || FLAG.test(cell)) continue;
        else if (AGE.test(cell)) age ??= Number(cell);
        else if (PHONE.test(cell)) result.phone ??= cell;
        else if (lower === 'ski alpin' || lower === 'alpin') result.sportType ??= 'Ski Alpin';
        else if (lower === 'snowboard' || lower === 'board') result.sportType ??= 'Snowboard';
        else if (boarding) result.boardingId ??= boarding.id;
        else if (matches.length)
            continue; // mehrdeutiges Boarding, nicht raten
        else if (commaName && !result.lastName) [, result.lastName, result.firstName] = commaName.map((v) => v?.trim());
        else names.push(cell);
    }

    if (!result.lastName) [result.firstName, result.lastName] = [names[0], names[1]];
    if (age !== undefined && !result.birthday) result.ageCategory = ageCategoryOf(age);
    return result;
};
