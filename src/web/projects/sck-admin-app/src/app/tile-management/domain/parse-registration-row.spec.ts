import { parseRegistrationRow } from './parse-registration-row';

describe('parseRegistrationRow', () => {
    const boardings = [
        { id: 'b1', name: 'Lauchheim' },
        { id: 'b2', name: 'Hülen Bushaltestelle Wiesenweg (5:30 Uhr)' },
    ];

    it('ordnet die Beispielzeile aus der Anmelde-Tabelle zu', () => {
        const row =
            'Markus\tUhl\tMarkus-uhl@gmx.de\t17639057670\t24.12.1983 (42)\t\tHülen Bushaltestelle Wiesenweg (5:30 Uhr)\tTAGESAUSFAHRT NACH EHRWALD\t23. Januar 2027\t31.10.2026, 16:06\n';

        expect(parseRegistrationRow(row, boardings)).toEqual({
            firstName: 'Markus',
            lastName: 'Uhl',
            email: 'Markus-uhl@gmx.de',
            phone: '17639057670',
            birthday: '1983-12-24',
            boardingId: 'b2',
        });
    });

    it('erkennt die Sportart unabhängig von der Spaltenposition (Kurs)', () => {
        const parsed = parseRegistrationRow('Ski Alpin\tAnna\tBauer\ta@b.de\t0170 123456\t01.02.2015 (11)');

        expect(parsed.sportType).toBe('Ski Alpin');
        expect(parsed.firstName).toBe('Anna');
        expect(parsed.lastName).toBe('Bauer');
        expect(parsed.birthday).toBe('2015-02-01');
    });

    it('Boarding ohne Treffer bleibt leer, einzelne Zeile ohne Tabs liefert nur den Namen', () => {
        expect(parseRegistrationRow('Max\tMuster', boardings).boardingId).toBeUndefined();
        expect(parseRegistrationRow('Max').firstName).toBe('Max');
    });

    it('ordnet die Zeile aus der Sheet-Liste zu ("Nachname, Vorname", Alter, eindeutiges Boarding)', () => {
        const row = 'Neukamm, Peter\t\t37\t15143255999\t\t100,00 €\t\t\t\tHülen\tChristian';

        expect(parseRegistrationRow(row, boardings)).toEqual({
            lastName: 'Neukamm',
            firstName: 'Peter',
            phone: '15143255999',
            boardingId: 'b2',
            ageCategory: 'adult',
        });
    });

    it('Alter -> Alterskategorie, aber nur ohne Geburtsdatum; mehrdeutiges Boarding wird nicht geraten', () => {
        expect(parseRegistrationRow('Muster, Max\t5').ageCategory).toBe('childUntil6');
        expect(parseRegistrationRow('Muster, Max\t12').ageCategory).toBe('youthUntil16');
        expect(parseRegistrationRow('Muster, Max\t30\t01.01.1996').ageCategory).toBeUndefined();

        const two = [
            { id: 'x1', name: 'Hülen Nord' },
            { id: 'x2', name: 'Hülen Süd' },
        ];
        expect(parseRegistrationRow('Muster, Max\tHülen', two).boardingId).toBeUndefined();
    });
});
