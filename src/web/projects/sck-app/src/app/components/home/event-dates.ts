const MONTHS = [
    'januar',
    'februar',
    'märz',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'dezember',
];

// "7. November 2026", "07. November 2026", "15. bis 16. März 2027" (auch "15.-16. März 2027") -> alle Tage
// (lokale Mitternacht). Alles andere (Freitext) -> null, der Aufrufer faellt dann auf das Ablaufdatum zurueck.
// Maximal 14 Tage, damit ein Tippfehler keinen Monat im Kalender fuellt.
export function parseEventDays(text: string | undefined | null): Date[] | null {
    const match = /^\s*(\d{1,2})\.\s*(?:(?:bis|-|–)\s*(\d{1,2})\.\s*)?([A-Za-zÄÖÜäöü]+)\s+(\d{4})\s*$/.exec(text ?? '');
    if (!match) return null;

    const month = MONTHS.indexOf(match[3].toLowerCase().replace('maerz', 'märz'));
    if (month < 0) return null;

    const year = Number(match[4]);
    const first = Number(match[1]);
    const last = match[2] ? Number(match[2]) : first;
    if (first < 1 || last < first || last - first > 13) return null;

    const days: Date[] = [];
    for (let day = first; day <= last; day++) {
        const date = new Date(year, month, day);
        // 31. November o. ae. rollt in den Folgemonat - dann ist das Datum ungueltig.
        if (date.getMonth() !== month) return null;
        days.push(date);
    }
    return days;
}
