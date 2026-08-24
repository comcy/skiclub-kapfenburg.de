import { GymCoursesRegisterFormFields } from 'projects/gym-lib/src/lib/ui/gym-courses-registration-form.interfaces';
import { CourseRegisterFormFields } from 'projects/courses-lib/src/lib/ui/course-registration-form/course-registration-form.interfaces';
import { TripParticipant } from 'projects/trips-lib/src/lib/domain/models';
import { TripRegisterFormValue } from 'projects/trips-lib/src/lib/ui/trips-registration-form/trips-registration-form.interfaces';
import { getCourseConfirmationMailBcc, getCourseConfirmationMailSubject } from './course-confirmation-mail.function';
import { getGymConfirmationMailBcc, getGymConfirmationMailSubject } from './pilates-confirmation-mail.function';
import {
    getTripConfirmationMailBcc,
    getTripConfirmationMailSubject,
    getTripConfirmationMailText,
} from './trip-confirmation-mail.function';

const makeParticipant = (overrides: Partial<TripParticipant> = {}): TripParticipant => ({
    firstName: 'Max',
    lastName: 'Mustermann',
    birthday: '2000-01-01',
    email: 'max@example.com',
    phone: '123',
    boarding: 'Board',
    ...overrides,
});

const makeTripValue = (overrides: Partial<TripRegisterFormValue> = {}): TripRegisterFormValue => ({
    additionalText: '',
    participants: [makeParticipant()],
    trip: { destination: 'Alps', date: '1.1.2026', availableBoardings: [] },
    ...overrides,
});

describe('Mail Template Domain Logic', () => {
    it('trip mail subject contains first name of the contact person (first participant)', () => {
        const subject = getTripConfirmationMailSubject(makeTripValue());
        expect(subject).toContain('Max');
    });

    it('course mail subject contains sportType and level', () => {
        const course: CourseRegisterFormFields = {
            firstName: 'Anna',
            lastName: 'Test',
            sportType: 'Snowboard',
            email: 'anna@example.com',
            phone: '456',
            age: '10',
            additionalText: '',
            level: 'Beginner',
        };
        const subject = getCourseConfirmationMailSubject(course);
        expect(subject).toContain('Snowboard');
        expect(subject).toContain('Beginner');
    });

    it('gym mail subject contains first name', () => {
        const gym: GymCoursesRegisterFormFields = {
            firstName: 'Lisa',
            lastName: 'Lustig',
            email: 'lisa@example.com',
            phone: '789',
            birthday: '2005-01-01',
            additionalText: '',
            course: { name: 'Pilates', description: '', details: '', time: '', location: '', contact: '' },
        };
        const subject = getGymConfirmationMailSubject(gym);
        expect(subject).toContain('Lisa');
    });

    it('trip, course, gym BCC lists contain registration address', () => {
        expect(getTripConfirmationMailBcc(makeTripValue())).toContain('registration@skiclub-kapfenburg.de');
        expect(
            getCourseConfirmationMailBcc({
                firstName: 'Anna',
                lastName: 'Test',
                sportType: 'Snowboard',
                email: 'anna@example.com',
                phone: '456',
                age: '10',
                additionalText: '',
                level: 'Beginner',
            }),
        ).toContain('registration@skiclub-kapfenburg.de');
        expect(getGymConfirmationMailBcc({})).toContain('registration@skiclub-kapfenburg.de');
    });

    describe('waitlist notice (Runde 3: Kapazitäts-Warnung + Warteliste)', () => {
        it('subject has no suffix and text has no waitlist notice when confirmed', () => {
            const values = makeTripValue({ waitlistInfo: { status: 'confirmed' } });

            expect(getTripConfirmationMailSubject(values)).not.toContain('Warteliste');
            expect(getTripConfirmationMailText(values)).not.toContain('Du stehst aktuell auf der Warteliste');
        });

        it('subject has no suffix and text has no waitlist notice when waitlistInfo is absent (fail-open)', () => {
            const values = makeTripValue();

            expect(getTripConfirmationMailSubject(values)).not.toContain('Warteliste');
            expect(getTripConfirmationMailText(values)).not.toContain('Du stehst aktuell auf der Warteliste');
        });

        it('subject gets a "(Warteliste)" suffix and text shows position + group size when waitlisted', () => {
            const values = makeTripValue({
                participants: [makeParticipant(), makeParticipant({ firstName: 'Erika' })],
                waitlistInfo: { status: 'waitlist', waitlistPosition: 3, waitlistCount: 2 },
            });

            expect(getTripConfirmationMailSubject(values)).toContain('(Warteliste)');
            const text = getTripConfirmationMailText(values);
            expect(text).toContain('Du stehst aktuell auf der Warteliste');
            expect(text).toContain('Position 3');
            expect(text).toContain('2 Personen');
        });

        it('renders singular "1 Person" for a single-person waitlist group', () => {
            const values = makeTripValue({
                waitlistInfo: { status: 'waitlist', waitlistPosition: 1, waitlistCount: 1 },
            });

            expect(getTripConfirmationMailText(values)).toContain('1 Person');
        });
    });
});
