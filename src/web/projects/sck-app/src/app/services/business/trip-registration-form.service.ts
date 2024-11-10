/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'projects/sck-app/src/environments/environment';
import { MailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';
import { TripRegistrationFormServiceInterface } from 'projects/trips-lib/src/lib/ui/trips-registration-form/trips-registration-form.interfaces';

@Injectable()
export class TripRegistrationFormService implements TripRegistrationFormServiceInterface {
    private readonly successMessage: string =
        'Ihre Anghaben wurden übertragen. Bitte kontaktieren Sie uns telefonisch falls Sie in den nächsten 3 Tagen keine Bestätighung per Mail erhalten haben.';
    private readonly errorMessage: string =
        'Beim Versand Ihrer Angaben ist ein Fehler aufgetreten. Bitte versuchen Sie es zu einem späteren Zeitpunkt noch einmal. Falls die Propbleme weiterhin bestehen nehmen Sie bitte telefonisch Kontakt mit uns auf.';
    private snackAction = 'Ok';

    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar,
    ) {}

    /**
     *
     * @param tripRegisterForm
     */
    sendFormToSheetsIo(formData: FormData): void {
        this.http.post(`${environment.tripSheetUrl}`, formData).subscribe({
            next: (response) => {
                console.log(response);
                this.snackBar.open(this.successMessage, this.snackAction);
            },
            error: (error) => {
                console.log(error);
                this.snackBar.open(this.errorMessage, this.snackAction);
            },
        });
    }

    public sendConfirmationMail(mailData: MailInformation): void {
        throw new Error(`Method not implemented. ${mailData}`);
    }
}

export const tripRegistrationServiceProvider = {
    provide: TripRegistrationFormServiceInterface,
    useClass: TripRegistrationFormService,
};
