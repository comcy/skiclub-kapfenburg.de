import { TripRegistration } from './trip-registration';

export interface CourseGroup {
    sport: string;
    level: string;
    registrations: TripRegistration[];
}

const NONE_SPORT = 'Ohne Sportart';
const NONE_LEVEL = 'Ohne Stufe';

// Kursanmeldungen einer Ausfahrt (ohne stornierte), gruppiert nach Sportart und Stufe.
// Sortierung: Sportart alphabetisch ("ohne" zuletzt), Stufe natürlich (A1 < A2 < A10), Personen nach Nachname.
export const courseGroups = (registrations: TripRegistration[]): CourseGroup[] => {
    const byKey = new Map<string, CourseGroup>();
    for (const r of registrations) {
        if (!r.courseRequested || r.status === 'cancelled') continue;
        const sport = r.sportType?.trim() || NONE_SPORT;
        const level = r.level?.trim() || NONE_LEVEL;
        const key = `${sport}\u0000${level}`;
        const group = byKey.get(key) ?? { sport, level, registrations: [] };
        group.registrations.push(r);
        byKey.set(key, group);
    }
    const last = (value: string, none: string): number => (value === none ? 1 : 0);
    return [...byKey.values()]
        .map((g) => ({
            ...g,
            registrations: [...g.registrations].sort(
                (a, b) => a.lastName.localeCompare(b.lastName, 'de') || a.firstName.localeCompare(b.firstName, 'de'),
            ),
        }))
        .sort(
            (a, b) =>
                last(a.sport, NONE_SPORT) - last(b.sport, NONE_SPORT) ||
                a.sport.localeCompare(b.sport, 'de') ||
                last(a.level, NONE_LEVEL) - last(b.level, NONE_LEVEL) ||
                a.level.localeCompare(b.level, 'de', { numeric: true }),
        );
};
