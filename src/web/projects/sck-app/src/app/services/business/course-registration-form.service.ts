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

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    CourseRegistrationFormServiceInterface,
    PublicCourseRegistrationInput,
} from 'projects/courses-lib/src/lib/ui/course-registration-form';
import { getCourseConfirmationSuccessMessage } from 'projects/data/mail-templates';
import { environment } from 'projects/sck-app/src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class CourseRegistrationFormService implements CourseRegistrationFormServiceInterface {
    private http = inject(HttpClient);
    private snackBar = inject(MatSnackBar);

    private snackAction = 'Ok';

    /**
     * This method is the implementation of the corresponding abstract declaration of the service inteface.
     * It is used to transmit the form data to any desired endpoint.
     * @param courseRegisterForm
     */
    sendFormToSheetsIo(formData: FormData, silent = false): void {
        this.http.post(`${environment.courseSheetUrl}`, formData).subscribe({
            next: (response) => {
                console.log(response);
                if (!silent) this.snackBar.open(getCourseConfirmationSuccessMessage(), this.snackAction);
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    public getTurnstileSiteKey(): string {
        return environment.turnstileSiteKey;
    }

    public submitPublicRegistration(
        tileId: string,
        input: PublicCourseRegistrationInput,
        turnstileToken: string,
    ): Observable<void> {
        return this.http.post<void>(`${environment.sckApiUrl}/tiles/${tileId}/course-registrations/public`, {
            ...input,
            turnstileToken,
        });
    }
}

export const courseRegistrationServiceProvider = {
    provide: CourseRegistrationFormServiceInterface,
    useClass: CourseRegistrationFormService,
};
