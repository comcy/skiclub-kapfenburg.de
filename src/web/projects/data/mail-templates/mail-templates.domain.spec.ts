import { CourseRegisterFormFields } from 'projects/courses-lib/src/lib/ui/course-registration-form/course-registration-form.interfaces';
import { GymCoursesRegisterFormFields } from 'projects/gym-lib/src/lib/ui/gym-courses-registration-form.interfaces';
import { TripRegisterFormValue } from 'projects/trips-lib/src/lib/ui/trips-registration-form/trips-registration-form.interfaces';
import { getCourseConfirmationMailBcc, getCourseConfirmationMailSubject } from './course-confirmation-mail.function';
import { getGymConfirmationMailBcc, getGymConfirmationMailSubject } from './pilates-confirmation-mail.function';
import { getTripConfirmationMailBcc, getTripConfirmationMailSubject } from './trip-confirmation-mail.function';

describe('Mail Template Domain Logic', () => {
    it('trip mail subject contains first name', () => {
        const trip: TripRegisterFormValue = {
            firstName: 'Max',
            lastName: 'Mustermann',
            phone: '123',
            email: 'max@example.com',
            amount: '1',
            additionalText: '',
            boarding: 'Board',
            trip: { destination: 'Alps', date: '1.1.2026', availableBoardings: [] },
        };
        const subject = getTripConfirmationMailSubject(trip);
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
            course: 'Pilates',
            email: 'lisa@example.com',
            phone: '789',
            age: '20',
            additionalText: '',
        };
        const subject = getGymConfirmationMailSubject(gym);
        expect(subject).toContain('Lisa');
    });

    it('trip, course, gym BCC lists contain registration address', () => {
        expect(getTripConfirmationMailBcc()).toContain('registration@skiclub-kapfenburg.de');
        expect(getCourseConfirmationMailBcc()).toContain('registration@skiclub-kapfenburg.de');
        expect(getGymConfirmationMailBcc()).toContain('registration@skiclub-kapfenburg.de');
    });
});
