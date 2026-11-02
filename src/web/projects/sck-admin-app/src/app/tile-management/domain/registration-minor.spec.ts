import { guardianOf, isMinor } from './registration-minor';

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
});
