import { parseEventDays } from './event-dates';

describe('parseEventDays', () => {
    const iso = (days: Date[] | null) => days?.map((d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);

    it('einzelner Tag, mit und ohne führende Null', () => {
        expect(iso(parseEventDays('7. November 2026'))).toEqual(['2026-11-7']);
        expect(iso(parseEventDays('07. November 2026'))).toEqual(['2026-11-7']);
        expect(iso(parseEventDays('01. März 2027'))).toEqual(['2027-3-1']);
    });

    it('Zeitraum "15. bis 16. März 2027" und Bindestrich', () => {
        expect(iso(parseEventDays('15. bis 16. März 2027'))).toEqual(['2027-3-15', '2027-3-16']);
        expect(iso(parseEventDays('15.-17. Januar 2027'))).toEqual(['2027-1-15', '2027-1-16', '2027-1-17']);
    });

    it('Freitext und ungültige Daten -> null', () => {
        expect(parseEventDays('')).toBeNull();
        expect(parseEventDays('Nach Schneelage')).toBeNull();
        expect(parseEventDays('31. November 2026')).toBeNull();
        expect(parseEventDays('24.09.2026 bis (einschl.) 17.12.2026')).toBeNull();
        expect(parseEventDays('1. Foo 2026')).toBeNull();
    });
});
