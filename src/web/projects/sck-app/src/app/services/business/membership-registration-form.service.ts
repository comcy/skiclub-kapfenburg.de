/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    getMembershipConfirmationMailSubject,
    getMembershipConfirmationMailText,
    getMembershipConfirmationSuccessMessage,
    getMembershipNotificationMailRecipients,
    getMembershipNotificationMailSubject,
    getMembershipNotificationMailText,
} from 'projects/data/mail-templates';
import {
    MembershipRegisterFormValue,
    MembershipRegistrationFormServiceInterface,
    MembershipRegistrationPayload,
} from 'projects/membership-lib/src/lib/ui/membership-registration-form/membership-registration-form.interfaces';
import { environment } from 'projects/sck-app/src/environments/environment';
import {
    FormToMailInformation,
    MailInformation,
} from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';

@Injectable()
export class MembershipRegistrationFormService implements MembershipRegistrationFormServiceInterface {
    private http = inject(HttpClient);
    private snackBar = inject(MatSnackBar);

    private snackAction = 'Ok';

    /**
     * Persists the registration (incl. SEPA/IBAN data) via sck-api. The API is responsible for
     * storing the IBAN field-encrypted and separate from the remaining registration data.
     */
    public submitRegistration(payload: MembershipRegistrationPayload): void {
        this.http.post(`${environment.sckApiUrl}/register/membership`, payload).subscribe({
            next: () => {
                this.snackBar.open(getMembershipConfirmationSuccessMessage(), this.snackAction);
            },
            error: (error) => {
                console.error('Fehler beim Speichern des Mitgliedsantrags:', error);
                this.snackBar.open('Fehler beim Speichern des Mitgliedsantrags', this.snackAction);
            },
        });
    }

    public sendConfirmationMail(mailData: FormToMailInformation<MembershipRegisterFormValue>): void {
        this.postMail({
            to: mailData.receiver,
            subject: getMembershipConfirmationMailSubject(mailData.formValues),
            text: getMembershipConfirmationMailText(mailData.formValues),
        });
    }

    /**
     * Separate notification mail to the board/treasurer - deliberately a distinct send (not bcc)
     * because its content omits the IBAN that the applicant's confirmation mail includes.
     */
    public sendBoardNotificationMail(mailData: FormToMailInformation<MembershipRegisterFormValue>): void {
        this.postMail({
            to: getMembershipNotificationMailRecipients(),
            subject: getMembershipNotificationMailSubject(mailData.formValues),
            text: getMembershipNotificationMailText(mailData.formValues),
        });
    }

    private postMail(mailData: MailInformation): void {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        this.http.post(`${environment.sckApiUrl}/send_email`, mailData, { headers }).subscribe({
            next: (response) => {
                console.log(response);
            },
            error: (error) => {
                console.error(error);
            },
        });
    }
}

export const membershipRegistrationServiceProvider = {
    provide: MembershipRegistrationFormServiceInterface,
    useClass: MembershipRegistrationFormService,
};
