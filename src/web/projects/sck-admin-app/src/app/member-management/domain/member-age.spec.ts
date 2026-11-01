import { Member } from './member';
import { ageOn, memberAgeAlerts } from './member-age';

const today = new Date(2026, 10, 1); // 1. Nov 2026
const member = (id: string, extra: Partial<Member>): Member => ({
    id,
    firstName: id,
    lastName: 'X',
    isFamilyMembership: true,
    status: 'active',
    source: 'manual',
    ...extra,
});

describe('member-age', () => {
    it('berechnet das Alter am Stichtag', () => {
        expect(ageOn('2008-11-01', today)).toBe(18);
        expect(ageOn('2008-11-02', today)).toBe(17);
        expect(ageOn('kaputt', today)).toBeUndefined();
    });

    it('meldet überfällige, bald 18-jährige Familienmitglieder und fehlende Geburtsdaten', () => {
        const alerts = memberAgeAlerts(
            [
                member('heute18', { birthday: '2008-11-01' }),
                member('schon19', { birthday: '2007-03-03' }),
                member('bald', { birthday: '2008-12-15' }),
                member('spaeter', { birthday: '2009-06-01' }),
                member('einzel', { birthday: '2000-01-01', isFamilyMembership: false }),
                member('ohne', { birthday: undefined }),
                member('inaktiv', { birthday: '2000-01-01', status: 'inactive' }),
            ],
            today,
        );
        expect(alerts.overdue.map((m) => m.id)).toEqual(['heute18', 'schon19']);
        expect(alerts.soon.map((m) => m.id)).toEqual(['bald']);
        expect(alerts.missingBirthday.map((m) => m.id)).toEqual(['ohne']);
    });
});
