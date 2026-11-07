export interface ColumnDef {
    key: string;
    label: string;
    // Standardmäßig sichtbar?
    default: boolean;
}

// Auswählbare Spalten der Anmeldeliste einer Ausfahrt (Name und Aktionen sind immer da).
export const REGISTRATION_COLUMNS: ColumnDef[] = [
    { key: 'age', label: 'Alter', default: true },
    { key: 'phone', label: 'Telefon', default: true },
    { key: 'boarding', label: 'Zustieg', default: false },
    { key: 'email', label: 'E-Mail', default: false },
    { key: 'member', label: 'Mitglied', default: true },
    { key: 'snowshoes', label: 'Schneeschuhe', default: true },
    { key: 'skipass', label: 'Skipass', default: true },
    { key: 'course', label: 'Kurs', default: true },
    { key: 'price', label: 'Preis', default: true },
    { key: 'status', label: 'Status', default: true },
    { key: 'external', label: 'Extern erfasst', default: true },
    { key: 'mail', label: 'Bestätigungsmail', default: true },
    { key: 'notes', label: 'Notizen', default: false },
];

export const defaultColumns = (): string[] => REGISTRATION_COLUMNS.filter((c) => c.default).map((c) => c.key);

// Gespeicherte Auswahl lesen; unbekannte Schlüssel fallen weg, ohne gültige Auswahl gilt der Standard.
export const parseColumns = (raw: string | null): string[] => {
    try {
        const list: unknown = JSON.parse(raw ?? 'null');
        if (Array.isArray(list)) {
            const known = new Set(REGISTRATION_COLUMNS.map((c) => c.key));
            return list.filter((k): k is string => typeof k === 'string' && known.has(k));
        }
    } catch {
        // ungültig -> Standard
    }
    return defaultColumns();
};

// Druck: "Leistungen" (Bus/Skipass, Schneeschuhe) hängt an den beiden Leistungs-Spalten.
export const printHas = (visible: Set<string>, key: string): boolean =>
    key === 'services' ? visible.has('snowshoes') || visible.has('skipass') : visible.has(key);
