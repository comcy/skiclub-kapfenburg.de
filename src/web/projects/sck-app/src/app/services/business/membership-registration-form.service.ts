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
import { Observable } from 'rxjs';

const SUCCESS_MESSAGE = `Dein Mitgliedsantrag wurde übermittelt. Du erhälst eine E-Mail mit einem Bestätigungslink - erst nach dessen Bestätigung wird dein Antrag bearbeitet.
    Solltest du keine E-Mail erhalten haben, prüfe bitte deinen Spam-Ordner. Solltest du auch dort keine E-Mail finden, kontaktiere uns bitte über: registration@skiclub-kapfenburg.de`;

@Injectable()
export class MembershipRegistrationFormService implements MembershipRegistrationFormServiceInterface {
    private http = inject(HttpClient);
    private snackBar = inject(MatSnackBar);

    private snackAction = 'Ok';

    /**
     * Submits the registration to sck-api, which persists it (IBAN field-encrypted, stored
     * separate from the rest) and sends the double-opt-in mail - see membership-controller.ts /
     * membership-mail-service.ts. The board notification only goes out once confirmRegistration()
     * below succeeds.
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

    public confirmRegistration(token: string): Observable<void> {
        return this.http.post<void>(`${environment.sckApiUrl}/membership/confirm`, { token });
    }
}

export const membershipRegistrationServiceProvider = {
    provide: MembershipRegistrationFormServiceInterface,
    useClass: MembershipRegistrationFormService,
};
