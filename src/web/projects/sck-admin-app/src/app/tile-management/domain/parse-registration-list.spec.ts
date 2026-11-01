import { parseRegistrationList } from './parse-registration-list';

describe('parseRegistrationList', () => {
    const boardings = [{ id: 'w1', name: 'Westhausen' }];
    const text = [
        'Name,Vorname\tTRUE\tAlter\tTelefon\t"Kurs \nSki/Alpin"\t\t"Schneeschuh \nVerleih"\tPreis\t"eingetragen\nvon:"',
        '\tFALSE\t\t\tS\tA\t\t',
        'Schmid Tobias\t\t\t\t\t\t\t\t\tTobi',
        'MV Mayr Andreas\t\t\t\t\t\t\t\t\tTobi',
        'MV Oppold Gerhard\tEZ\t\t\t\t\t\t\t\tTobi',
        'Knoll Ida\t5\tK\t\t\t\t\t\t\tTobi',
        'Rup Philomena\t8\tK',
        'Köppel Sabine\t\t\t\t\t\t\t\tWesthausen\tMagges',
        '',
    ].join('\n');

    it('liest Name, Alter, Kürzel und Zustieg; Kopf und Legende werden ignoriert', () => {
        const { rows, ignored } = parseRegistrationList(text, boardings);

        expect(ignored).toBe(2); // Kopfzeile (mehrzeilige Zellen) + Legende
        expect(rows.map((r) => `${r.lastName}|${r.firstName}`)).toEqual([
            'Schmid|Tobias',
            'Mayr|Andreas',
            'Oppold|Gerhard',
            'Knoll|Ida',
            'Rup|Philomena',
            'Köppel|Sabine',
        ]);
        expect(rows[1].notes).toBe('MV');
        expect(rows[2].notes).toBe('MV, EZ');
        expect(rows[3].ageCategory).toBe('childUntil6');
        expect(rows[4].ageCategory).toBe('youthUntil16');
        expect(rows[0].ageCategory).toBe('adult');
        expect(rows[5].boardingId).toBe('w1');
    });

    it('kennt auch "Nachname, Vorname" und mehrteilige Nachnamen', () => {
        const { rows } = parseRegistrationList('Neukamm, Peter\nvon der Heide Anna');
        expect(rows.map((r) => `${r.lastName}|${r.firstName}`)).toEqual(['Neukamm|Peter', 'von der Heide|Anna']);
    });
});
