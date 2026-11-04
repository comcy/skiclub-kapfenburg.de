import { courseGroups } from './registration-courses';
import { TripRegistration } from './trip-registration';

const reg = (p: Partial<TripRegistration>): TripRegistration =>
    ({
        id: p.lastName ?? 'x',
        firstName: 'A',
        lastName: 'B',
        status: 'confirmed',
        courseRequested: true,
        ...p,
    }) as TripRegistration;

describe('courseGroups', () => {
    it('gruppiert nach Sportart und Stufe, ignoriert Nicht-Kurs und Stornierte', () => {
        const groups = courseGroups([
            reg({ lastName: 'Zeta', sportType: 'Ski', level: 'A2' }),
            reg({ lastName: 'Alpha', sportType: 'Ski', level: 'A2' }),
            reg({ lastName: 'Beta', sportType: 'Snowboard', level: 'A1' }),
            reg({ lastName: 'Gamma', sportType: 'Ski', level: 'A10' }),
            reg({ lastName: 'Delta', sportType: 'Ski', level: 'A1', status: 'cancelled' }),
            reg({ lastName: 'Eps', courseRequested: false, sportType: 'Ski', level: 'A1' }),
            reg({ lastName: 'Ohne' }),
        ]);
        expect(groups.map((g) => `${g.sport} ${g.level}`)).toEqual([
            'Ski A2',
            'Ski A10',
            'Snowboard A1',
            'Ohne Sportart Ohne Stufe',
        ]);
        expect(groups[0].registrations.map((r) => r.lastName)).toEqual(['Alpha', 'Zeta']);
    });
});
