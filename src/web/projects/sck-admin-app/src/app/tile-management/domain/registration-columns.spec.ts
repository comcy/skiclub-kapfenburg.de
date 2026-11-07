import { defaultColumns, parseColumns, printHas } from './registration-columns';

describe('registration-columns', () => {
    it('Standard blendet E-Mail und Notizen aus', () => {
        const d = defaultColumns();
        expect(d).toContain('phone');
        expect(d).not.toContain('email');
        expect(d).not.toContain('boarding');
        expect(d).not.toContain('notes');
    });

    it('parseColumns: gültige Auswahl, unbekannte Schlüssel fallen weg, Müll -> Standard', () => {
        expect(parseColumns('["phone","email","gibtsnicht"]')).toEqual(['phone', 'email']);
        expect(parseColumns('[]')).toEqual([]);
        expect(parseColumns(null)).toEqual(defaultColumns());
        expect(parseColumns('kaputt')).toEqual(defaultColumns());
    });

    it('printHas: Leistungen sichtbar, wenn Schneeschuhe oder Skipass sichtbar', () => {
        expect(printHas(new Set(['skipass']), 'services')).toBeTrue();
        expect(printHas(new Set(['phone']), 'services')).toBeFalse();
        expect(printHas(new Set(['phone']), 'phone')).toBeTrue();
    });
});
