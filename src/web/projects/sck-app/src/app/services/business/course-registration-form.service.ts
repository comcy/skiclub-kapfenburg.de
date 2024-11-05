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
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseRegistrationFormServiceInterface } from 'projects/courses-lib/src/lib/ui/course-registration-form';
import { environment } from 'projects/sck-app/src/environments/environment';

@Injectable()
export class CourseRegistrationFormService implements CourseRegistrationFormServiceInterface {
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
     * This method is the implementation of the corresponding abstract declaration of the service inteface.
     * It is used to transmit the form data to any desired endpoint.
     * @param courseRegisterForm
     */
    sendFormToSheetsIo(formData: FormData) {
        this.http.post(`${environment.courseSheetUrl}`, formData).subscribe({
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

    /**
     * This method is the implementation of the corresponding abstract declaration
     * of the service inteface which can be used to invoke a transmission of a confirmation mail.
     *
     * This method triggers the `sck-api` which will send a confirmation mail with all relevant form data.
     * @param formData, the dataset of the course registration form.
     */
    sendConfirmationMail(formData: FormData) {
        console.log(formData);
    }
}

export const courseRegistrationServiceProvider = {
    provide: CourseRegistrationFormServiceInterface,
    useClass: CourseRegistrationFormService,
};
