/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    getTripConfirmationSuccessMessage,
    getTripConfirmationMailBcc,
    getTripConfirmationMailSubject,
    getTripConfirmationMailText,
} from 'projects/data/mail-templates';
import { environment } from 'projects/sck-app/src/environments/environment';
import {
    FormToMailInformation,
    MailInformation,
} from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';
import {
    TripRegisterFormFields,
    TripRegistrationFormServiceInterface,
} from 'projects/trips-lib/src/lib/ui/trips-registration-form/trips-registration-form.interfaces';

@Injectable()
export class TripRegistrationFormService implements TripRegistrationFormServiceInterface {
    private http = inject(HttpClient);
    private snackBar = inject(MatSnackBar);

    private snackAction = 'Ok';

    /**
     *
     * @param tripRegisterForm
     */
    public sendFormToSheetsIo(formData: FormData): void {
        this.http.post(`${environment.tripSheetUrl}`, formData).subscribe({
            next: (response) => {
                console.log(response);
                this.snackBar.open(getTripConfirmationSuccessMessage(), this.snackAction);
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    public sendConfirmationMail(formToMailData: FormToMailInformation<TripRegisterFormFields>): void {
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
                this.snackBar.open(getTripConfirmationSuccessMessage(), this.snackAction);
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    private getSubjectText(values: TripRegisterFormFields): string {
        return getTripConfirmationMailSubject(values);
    }

    private getBccReceivers(): string {
        return getTripConfirmationMailBcc();
    }

    private getMailText(values: TripRegisterFormFields): string {
        return getTripConfirmationMailText(values);
    }
}

export const tripRegistrationServiceProvider = {
    provide: TripRegistrationFormServiceInterface,
    useClass: TripRegistrationFormService,
};
