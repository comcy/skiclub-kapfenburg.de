import { GymCoursesRegisterFormFields } from 'projects/gym-lib/src/lib/ui/gym-courses-registration-form.interfaces';
import { getGymConfirmationMailBcc, getGymConfirmationMailSubject } from './pilates-confirmation-mail.function';
import { renderTemplate } from './template-engine';

describe('Mail Template Domain Logic', () => {
    // Course/trip confirmation mails are now rendered server-side (see the
    // plan) - their subject/BCC/text logic is tested in sck-api's
    // course-registration-mail-service/trip-registration-mail-service tests
    // instead. Gym keeps sending mail client-side (out of scope), so its
    // coverage stays here.
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

    it('gym BCC list contains registration address', () => {
        expect(getGymConfirmationMailBcc({})).toContain('registration@skiclub-kapfenburg.de');
    });

    describe('renderTemplate', () => {
        it('substitutes known tokens and leaves unknown ones untouched', () => {
            expect(renderTemplate('Hallo {{firstName}}, {{unknown}}!', { firstName: 'Anna' })).toBe(
                'Hallo Anna, {{unknown}}!',
            );
        });
    });
});
