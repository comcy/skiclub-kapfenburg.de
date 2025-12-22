/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    getTripConfirmationMailBcc,
    getTripConfirmationMailSubject,
    getTripConfirmationMailText,
    getTripConfirmationSuccessMessage,
} from 'projects/data/mail-templates';
import { environment } from 'projects/sck-app/src/environments/environment';
import {
    FormToMailInformation,
    MailInformation,
} from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';
import {
    SheetDbRow,
    TripRegisterFormValue,
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
    public sendFormToSheetsIo(rows: SheetDbRow[]): void {
        this.http.post(`${environment.tripSheetUrl}`, { data: rows }).subscribe({
            next: (response) => {
                console.log('SheetDB response:', response);
                this.snackBar.open(getTripConfirmationSuccessMessage(), this.snackAction);
            },
            error: (error) => {
                console.error('SheetDB error:', error);
                this.snackBar.open('Fehler beim Speichern der Anmeldung', this.snackAction);
            },
        });
    }

    public sendConfirmationMail(formToMailData: FormToMailInformation<TripRegisterFormValue>): void {
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

    private getSubjectText(values: TripRegisterFormValue): string {
        return getTripConfirmationMailSubject(values);
    }

    private getBccReceivers(): string {
        return getTripConfirmationMailBcc();
    }

    private getMailText(values: TripRegisterFormValue): string {
        return getTripConfirmationMailText(values);
    }
}

export const tripRegistrationServiceProvider = {
    provide: TripRegistrationFormServiceInterface,
    useClass: TripRegistrationFormService,
};
