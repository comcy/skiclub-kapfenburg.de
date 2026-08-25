/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    MembershipRegisterFormValue,
    MembershipRegistrationFormServiceInterface,
} from 'projects/membership-lib/src/lib/ui/membership-registration-form/membership-registration-form.interfaces';
import { environment } from 'projects/sck-app/src/environments/environment';

const SUCCESS_MESSAGE = `Dein Mitgliedsantrag wurde übermittelt. Du erhälst zur Kontrolle der Eingabe eine Bestätigungsmail.
    Solltest du keine E-Mail erhalten haben, prüfe bitte deinen Spam-Ordner. Solltest du auch dort keine E-Mail finden, kontaktiere uns bitte über: registration@skiclub-kapfenburg.de`;

@Injectable()
export class MembershipRegistrationFormService implements MembershipRegistrationFormServiceInterface {
    private http = inject(HttpClient);
    private snackBar = inject(MatSnackBar);

    private snackAction = 'Ok';

    /**
     * Submits the registration to sck-api, which persists it (IBAN field-encrypted, stored
     * separate from the rest) and sends both the applicant confirmation and the board
     * notification mail itself - see membership-controller.ts / membership-mail-service.ts.
     */
    public submitRegistration(formValue: MembershipRegisterFormValue): void {
        this.http.post(`${environment.sckApiUrl}/membership/register`, formValue).subscribe({
            next: () => {
                this.snackBar.open(SUCCESS_MESSAGE, this.snackAction);
            },
            error: (error) => {
                console.error('Fehler beim Speichern des Mitgliedsantrags:', error);
                this.snackBar.open('Fehler beim Speichern des Mitgliedsantrags', this.snackAction);
            },
        });
    }

    public getTurnstileSiteKey(): string {
        return environment.turnstileSiteKey;
    }
}

export const membershipRegistrationServiceProvider = {
    provide: MembershipRegistrationFormServiceInterface,
    useClass: MembershipRegistrationFormService,
};
