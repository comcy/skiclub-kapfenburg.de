/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    getGymConfirmationMailBcc,
    getGymConfirmationMailText,
} from 'projects/data/mail-templates/pilates-confirmation-mail.function';
import {
    GymCoursesRegisterFormFields,
    GymCoursesRegistrationFormServiceInterface,
} from 'projects/gym-lib/src/lib/ui/gym-courses-registration-form.interfaces';
import { environment } from 'projects/sck-app/src/environments/environment';
import {
    FormToMailInformation,
    MailInformation,
} from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';

@Injectable()
export class GymCoursesRegistrationFormService implements GymCoursesRegistrationFormServiceInterface {
    private snackAction = 'Ok';
    private http = inject(HttpClient);
    private snackBar = inject(MatSnackBar);

    public sendConfirmationMail(formToMailData: FormToMailInformation<GymCoursesRegisterFormFields>): void {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        const mailData: MailInformation = {
            to: formToMailData.receiver,
            subject: this.getSubjectText(formToMailData.formValues),
            text: this.getMailText(formToMailData.formValues),
            bcc: this.getBccReceivers(),
        };

        this.http.post(`${environment.sckApiUrl}/send_email`, mailData, { headers }).subscribe({
            next: (response) => {
                console.log(response);
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    private getSubjectText(values: GymCoursesRegisterFormFields): string {
        return getGymConfirmationMailSubject(values);
    }

    private getBccReceivers(): string {
        return getGymConfirmationMailBcc();
    }

    private getMailText(values: GymCoursesRegisterFormFields): string {
        return getGymConfirmationMailText(values);
    }
}

export const gymCoursesRegisterFormServiceProvider = {
    provide: GymCoursesRegistrationFormServiceInterface,
    useClass: GymCoursesRegistrationFormService,
};
