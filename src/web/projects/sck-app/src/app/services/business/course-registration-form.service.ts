/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

/**
 * @file This file contains the implementation of the CourseRegistrationFormService class.
 * It is part of the course registration form feature of the SCK app.
 *
 * (c) 2021 comcy <comcy@github.com>
 * License: MIT
 */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    CourseRegisterFormFields,
    CourseRegistrationFormServiceInterface,
} from 'projects/courses-lib/src/lib/ui/course-registration-form';
import {
    getCourseConfirmationMailBcc,
    getCourseConfirmationMailSubject,
    getCourseConfirmationMailText,
    getTripConfirmationSuccessMessage,
} from 'projects/data/mail-templates';
import { environment } from 'projects/sck-app/src/environments/environment';
import {
    FormToMailInformation,
    MailInformation,
} from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';

@Injectable()
export class CourseRegistrationFormService implements CourseRegistrationFormServiceInterface {
    private snackAction = 'Ok';

    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar,
    ) {}

    /**
     * This method is the implementation of the corresponding abstract declaration of the service inteface.
     * It is used to transmit the form data to any desired endpoint.
     * @param courseRegisterForm
     */
    sendFormToSheetsIo(formData: FormData): void {
        this.http.post(`${environment.courseSheetUrl}`, formData).subscribe({
            next: (response) => {
                console.log(response);
                this.snackBar.open(getTripConfirmationSuccessMessage(), this.snackAction);
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    /**
     * This method is the implementation of the corresponding abstract declaration
     * of the service inteface which can be used to invoke a transmission of a confirmation mail.
     *
     * This method triggers the `sck-api` which will send a confirmation mail with all relevant form data.
     * @param formData, the dataset of the course registration form.
     */
    sendConfirmationMail(formToMailData: FormToMailInformation<CourseRegisterFormFields>): void {
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

    private getSubjectText(values: CourseRegisterFormFields): string {
        return getCourseConfirmationMailSubject(values);
    }

    private getBccReceivers(): string {
        return getCourseConfirmationMailBcc();
    }

    private getMailText(values: CourseRegisterFormFields): string {
        return getCourseConfirmationMailText(values);
    }
}

export const courseRegistrationServiceProvider = {
    provide: CourseRegistrationFormServiceInterface,
    useClass: CourseRegistrationFormService,
};
