import { parseMemberList } from './parse-member-list';

const SAMPLE = `1010,"Manuelo Abelas
Am Hasenfick 23

D-72492 Kraich-Schwabsberg
",,,,Tel. 1:,0152/66887970,,Eintrittsdatum:,,,14.03.2017,,,
,,,,,Tel. 2:,,,Austrittsdatum:,,,,,,
,,,,,Fax:,,,Aktiv von bis:,,,,-,,
,,,,,Mobil:,,,Zahlungsbedingung/-art:,,,SEPA-Lastschrift,,,
,,,,,E-Mail:,manuelo.abelas@me.com,,Kategorie:,,,Mitglieder,,,
,,,,,,,,Bank:,,,KSC Eastalb,,,
,,,,,,,,BLZ / BIC:,,,OASPDE6AXXX,,,
,,,,,,,,Kontonummer / IBAN:,,,DE02120300000000202051,,,
,,,,,,,,Kontoinhaber:,,,Abelas,,,
1011,"Eva Abelas
Am Hasenfick 23

D-72492 Kraich-Schwabsberg
",,,,Tel. 1:,,,Eintrittsdatum:,,,01.01.2020,,,
,,,,,E-Mail:,,,Bank:,,,KSC Eastalb,,,
`;

describe('parseMemberList', () => {
    it('liest mehrzeilige Blöcke (CSV) in Importdatensätze', () => {
        const [first, second] = parseMemberList(SAMPLE);
        expect(first).toEqual({
            Nr: '1010',
            Name: 'Manuelo Abelas',
            Adresse: 'Am Hasenfick 23, D-72492 Kraich-Schwabsberg',
            Eintrittsdatum: '14.03.2017',
            Kommunikation: { 'Tel 1': '0152/66887970', 'E-Mail': 'manuelo.abelas@me.com' },
            Bankdaten: {
                Bank: 'KSC Eastalb',
                BIC: 'OASPDE6AXXX',
                IBAN: 'DE02120300000000202051',
                Kontoinhaber: 'Abelas',
            },
            Zahlungsbedingung: 'SEPA-Lastschrift',
        });
        expect(parseMemberList(SAMPLE).length).toBe(2);
        // leeres Label ("E-Mail:" gefolgt von einem Label) bleibt leer, nimmt keinen fremden Wert
        expect(second.Kommunikation['E-Mail']).toBeUndefined();
        expect(second.Eintrittsdatum).toBe('01.01.2020');
    });

    it('liest auch Tab-getrennte Zwischenablage (aus Excel/Sheets)', () => {
        const tsv = SAMPLE.split('\n')
            .map((l) => l)
            .join('\n')
            .replace(/,/g, '\t');
        expect(parseMemberList(tsv)[0].Nr).toBe('1010');
    });
});
