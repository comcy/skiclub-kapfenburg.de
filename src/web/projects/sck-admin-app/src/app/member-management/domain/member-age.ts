import { Member } from './member';

const ADULT_AGE = 18;
const SOON_DAYS = 60;

// Alter in vollen Jahren zum Stichtag (ISO-Datum, lokal gelesen - nie als UTC-Mitternacht geparst).
export const ageOn = (birthday: string, today: Date): number | undefined => {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthday);
    if (!match) return undefined;
    const [, y, m, d] = match.map(Number);
    let age = today.getFullYear() - y;
    if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age -= 1;
    return age;
};

// Tage bis zum 18. Geburtstag (negativ = schon vorbei).
const daysUntil18 = (birthday: string, today: Date): number | undefined => {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthday);
    if (!match) return undefined;
    const [, y, m, d] = match.map(Number);
    const eighteenth = new Date(y + ADULT_AGE, m - 1, d);
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.round((eighteenth.getTime() - start.getTime()) / 86_400_000);
};

export interface MemberAgeAlerts {
    // Familienmitglieder, die 18 sind/wurden -> Einzelmitgliedschaft prüfen.
    overdue: Member[];
    // Familienmitglieder, die in den nächsten 60 Tagen 18 werden.
    soon: Member[];
    // Aktive Mitglieder ohne Geburtsdatum (Pflege nötig, sonst keine Meldung möglich).
    missingBirthday: Member[];
}

export const memberAgeAlerts = (members: Member[], today: Date = new Date()): MemberAgeAlerts => {
    const active = members.filter((m) => m.status === 'active');
    const family = active.filter((m) => m.isFamilyMembership);
    const withDays = family
        .filter((m) => m.birthday)
        .map((m) => ({ m, days: daysUntil18(m.birthday!, today) }))
        .filter((x): x is { m: Member; days: number } => x.days !== undefined);
    return {
        overdue: withDays.filter((x) => x.days <= 0).map((x) => x.m),
        soon: withDays.filter((x) => x.days > 0 && x.days <= SOON_DAYS).map((x) => x.m),
        missingBirthday: active.filter((m) => !m.birthday),
    };
};
