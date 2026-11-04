export type SortDirection = 'asc' | 'desc' | '';
type SortValue = string | number | null | undefined;

// Clientseitige Listen-Sortierung (für Mat-Sort-Header). Leere Werte stehen immer am Ende, Text deutsch/natürlich
// (A2 < A10), Zahlen numerisch. Ohne aktive Spalte/Richtung bleibt die Reihenfolge unverändert.
export const sortItems = <T>(
    items: T[],
    active: string,
    direction: SortDirection,
    accessors: Record<string, (item: T) => SortValue>,
): T[] => {
    const get = accessors[active];
    if (!get || !direction) return items;
    const factor = direction === 'asc' ? 1 : -1;
    return [...items].sort((a, b) => {
        const x = get(a);
        const y = get(b);
        const emptyX = x === null || x === undefined || x === '';
        const emptyY = y === null || y === undefined || y === '';
        if (emptyX || emptyY) return emptyX === emptyY ? 0 : emptyX ? 1 : -1;
        if (typeof x === 'number' && typeof y === 'number') return (x - y) * factor;
        return String(x).localeCompare(String(y), 'de', { numeric: true, sensitivity: 'base' }) * factor;
    });
};
