import { registrationAlerts } from './registration-alerts';
import { TripRegistration } from './trip-registration';

const reg = (o: Partial<TripRegistration>): TripRegistration =>
    ({
        id: Math.random().toString(),
        tileId: 't',
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.de',
        birthday: '1990-01-01',
        boardingId: 'b1',
        ageCategory: 'adult',
        isMember: false,
        selfReportedIsMember: false,
        status: 'confirmed',
        guardianConsent: false,
        ...o,
    }) as TripRegistration;

describe('registrationAlerts', () => {
    it('findet Unregelmäßigkeiten, ignoriert Stornierte und Normalfälle', () => {
        const ok = reg({});
        const kid = reg({ birthday: '2015-01-01', ageCategory: 'youthUntil16' });
        const kidWithParent = reg({ birthday: '2015-01-01', ageCategory: 'youthUntil16', guardianType: 'parent' });
        const unverified = reg({ selfReportedIsMember: true });
        const noMail = reg({ email: undefined });
        const linkedNoMail = reg({ email: undefined, registeredById: ok.id });
        const noBoarding = reg({ boardingId: undefined });
        const noDob = reg({ birthday: undefined });
        const cancelled = reg({ status: 'cancelled', email: undefined });
        const a = registrationAlerts(
            [ok, kid, kidWithParent, unverified, noMail, linkedNoMail, noBoarding, noDob, cancelled],
            new Set([ok.id]),
        );
        expect(a.minors).toEqual([kid]);
        expect(a.unverified).toEqual([unverified]);
        expect(a.noContact).toEqual([noMail]);
        expect(a.noBoarding).toEqual([noBoarding]);
        expect(a.noBirthday).toEqual([noDob]);
        expect(a.emergency).toEqual([ok]);
    });
});
