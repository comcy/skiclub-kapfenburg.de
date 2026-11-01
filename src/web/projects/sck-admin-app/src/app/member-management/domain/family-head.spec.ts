import { Member } from './member';
import { familyHeadOrder } from './family-head';

const m = (firstName: string, extra: Partial<Member> = {}): Member => ({
    id: firstName,
    firstName,
    lastName: 'Mayer',
    isFamilyMembership: true,
    status: 'active',
    source: 'imported',
    memberSince: '2018-12-18',
    ...extra,
});

const head = (members: Member[]): string => [...members].sort(familyHeadOrder)[0].firstName;

describe('familyHeadOrder', () => {
    it('Kontoinhaber vor Alphabet, auch wenn alles andere gleich ist', () => {
        const family = [
            m('Laura'),
            m('Markus', { accountHolder: 'Markus Mayer', iban: 'DE02120300000000202051' }),
            m('Maya'),
            m('Theodor'),
        ];
        expect(head(family)).toBe('Markus');
    });

    it('Kontoinhaber nur mit Nachnamen trifft niemanden gezielt -> IBAN entscheidet', () => {
        const family = [
            m('Laura', { accountHolder: 'Mayer' }),
            m('Markus', { accountHolder: 'Mayer', iban: 'DE02120300000000202051' }),
        ];
        expect(head(family)).toBe('Markus');
    });

    it('ohne Bankdaten: E-Mail, dann Eintrittsdatum, dann Name', () => {
        expect(head([m('Anna'), m('Zoe', { email: 'zoe@mayer.de' })])).toBe('Zoe');
        expect(head([m('Anna'), m('Zoe', { memberSince: '2010-01-01' })])).toBe('Zoe');
        expect(head([m('Zoe'), m('Anna')])).toBe('Anna');
    });
});
