import { buildMemberExport, defaultExportKeys } from './member-export';
import { Member } from './member';

const member: Member = {
    id: '1',
    firstName: 'Max',
    lastName: 'Muster; "Chef"',
    email: 'm@x.de',
    birthday: '1990-01-05',
    isFamilyMembership: false,
    status: 'active',
    source: 'manual',
    iban: 'DE89370400440532013000',
    accountHolder: 'Max Muster',
    notes: 'a\nb',
};

describe('buildMemberExport', () => {
    it('nimmt die IBAN per Default nicht mit und lässt leere Felder weg', () => {
        const text = buildMemberExport([member], defaultExportKeys(), 'text');
        expect(text).not.toContain('IBAN');
        expect(text).toContain('Geburtsdatum: 05.01.1990');
        expect(text).not.toContain('Mobil');
    });

    it('gruppiert die IBAN in Vierergruppen, wenn sie gewählt ist', () => {
        const text = buildMemberExport([member], [...defaultExportKeys(), 'iban'], 'text');
        expect(text).toContain('IBAN: DE89 3704 0044 0532 0130 00');
    });

    it('CSV: Semikolon, Anführungszeichen verdoppelt, Zeilenumbrüche in Notizen entfernt', () => {
        const csv = buildMemberExport([member, member], ['lastName', 'notes'], 'csv');
        expect(csv).toBe('Nachname;Notizen\n"Muster; ""Chef""";a b\n"Muster; ""Chef""";a b');
    });

    it('TSV ohne Kopfzeile und leere Auswahl', () => {
        expect(buildMemberExport([member], ['lastName'], 'tsv', false)).toBe('Muster; "Chef"');
        expect(buildMemberExport([], ['lastName'], 'text')).toBe('');
        expect(buildMemberExport([member], [], 'text')).toBe('');
    });
});
