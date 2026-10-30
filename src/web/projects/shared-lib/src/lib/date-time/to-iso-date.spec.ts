import { toIsoDate } from './to-iso-date';

describe('toIsoDate', () => {
    it('behält den lokalen Kalendertag (kein UTC-Versatz)', () => {
        expect(toIsoDate(new Date(2000, 4, 10))).toBe('2000-05-10');
        expect(toIsoDate(new Date(2000, 0, 1))).toBe('2000-01-01');
    });
    it('leer/ungültig -> undefined', () => {
        expect(toIsoDate(null)).toBeUndefined();
        expect(toIsoDate('')).toBeUndefined();
        expect(toIsoDate('kein datum')).toBeUndefined();
    });
});
