/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getTripConfirmationSuccessMessage } from 'projects/data/mail-templates';
import { environment } from 'projects/sck-app/src/environments/environment';
import {
    PublicRegistrationParticipantInput,
    SheetDbRow,
    TripPricePreviewParticipant,
    TripPricePreviewResult,
    TripRegistrationFormServiceInterface,
    WaitlistInfo,
} from 'projects/trips-lib/src/lib/ui/trips-registration-form/trips-registration-form.interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class TripRegistrationFormService implements TripRegistrationFormServiceInterface {
    private http = inject(HttpClient);
    private snackBar = inject(MatSnackBar);

    private snackAction = 'Ok';

    /**
     *
     * @param tripRegisterForm
     */
    public sendFormToSheetsIo(rows: SheetDbRow[], silent = false): void {
        this.http.post(`${environment.tripSheetUrl}`, { data: rows }).subscribe({
            next: (response) => {
                console.log('SheetDB response:', response);
                if (!silent) this.snackBar.open(getTripConfirmationSuccessMessage(), this.snackAction);
            },
            error: (error) => {
                console.error('SheetDB error:', error);
                if (!silent) this.snackBar.open('Fehler beim Speichern der Anmeldung', this.snackAction);
            },
        });
    }

    public submitPublicRegistration(
        tileId: string,
        participants: PublicRegistrationParticipantInput[],
        turnstileToken: string,
    ): Observable<WaitlistInfo> {
        return this.http.post<WaitlistInfo>(`${environment.sckApiUrl}/tiles/${tileId}/registrations/public`, {
            participants,
            turnstileToken,
        });
    }

    public getTurnstileSiteKey(): string {
        return environment.turnstileSiteKey;
    }

    public getTripPricePreview(
        tileId: string,
        participants: TripPricePreviewParticipant[],
    ): Observable<TripPricePreviewResult> {
        return this.http.post<TripPricePreviewResult>(`${environment.sckApiUrl}/tiles/${tileId}/trip-price-preview`, {
            participants,
        });
    }
}

export const tripRegistrationServiceProvider = {
    provide: TripRegistrationFormServiceInterface,
    useClass: TripRegistrationFormService,
};
