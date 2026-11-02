import { guardianOf, isMinor, minorState } from './registration-minor';

describe('registration-minor', () => {
    const today = new Date(2027, 0, 23);

    it('unter 18 mit Geburtsdatum ist minderjährig, am 18. Geburtstag nicht mehr', () => {
        expect(isMinor({ birthday: '2009-01-24', ageCategory: 'adult' }, today)).toBeTrue();
        expect(isMinor({ birthday: '2009-01-23', ageCategory: 'adult' }, today)).toBeFalse();
    });

    it('ohne Geburtsdatum zählt die Altersgruppe', () => {
        expect(isMinor({ ageCategory: 'youthUntil16' }, today)).toBeTrue();
        expect(isMinor({ ageCategory: 'adult' }, today)).toBeFalse();
    });

    it('Erziehungsberechtigte(r) ist ersatzweise der Hauptanmelder', () => {
        expect(guardianOf({ guardianName: 'Anna', registeredByName: 'Markus' })).toBe('Anna');
        expect(guardianOf({ registeredByName: 'Markus' })).toBe('Markus');
        expect(guardianOf({})).toBeUndefined();
    });

    it('Stand: Elternteil dabei / Einverständnis / offen / erwachsen', () => {
        const kid = { birthday: '2015-01-01', ageCategory: 'youthUntil16' as const };
        expect(minorState({ ...kid, guardianType: 'parent', guardianConsent: false })).toBe('parent');
        expect(minorState({ ...kid, guardianType: 'other', guardianConsent: true })).toBe('consent');
        expect(minorState({ ...kid, guardianConsent: false })).toBe('open');
        expect(minorState({ birthday: '1980-01-01', ageCategory: 'adult', guardianConsent: false })).toBe('adult');
    });
});
