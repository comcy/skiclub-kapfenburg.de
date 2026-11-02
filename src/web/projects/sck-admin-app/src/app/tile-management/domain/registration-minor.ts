import { TripRegistration } from './trip-registration';

// Minderjährig (unter 18): mit Geburtsdatum exakt, sonst über die Altersgruppe (Jugend/Kind).
export const isMinor = (r: Pick<TripRegistration, 'birthday' | 'ageCategory'>, today: Date = new Date()): boolean => {
    const dob = r.birthday ? new Date(r.birthday) : undefined;
    if (!dob || isNaN(dob.getTime())) return r.ageCategory !== 'adult';
    const adultFrom = new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate());
    return today < adultFrom;
};

// Stand der Minderjährigkeit: geklärt durch teilnehmendes Elternteil, durch Einverständniserklärung, oder offen.
export type MinorState = 'adult' | 'parent' | 'consent' | 'open';
export const minorState = (
    r: Pick<TripRegistration, 'birthday' | 'ageCategory' | 'guardianType' | 'guardianConsent'>,
): MinorState =>
    !isMinor(r) ? 'adult' : r.guardianType === 'parent' ? 'parent' : r.guardianConsent ? 'consent' : 'open';

// Erziehungsberechtigte(r): explizit hinterlegt, sonst der Hauptanmelder.
export const guardianOf = (r: Pick<TripRegistration, 'guardianName' | 'registeredByName'>): string | undefined =>
    r.guardianName || r.registeredByName || undefined;
