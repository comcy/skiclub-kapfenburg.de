/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from 'projects/shared-lib/src/lib/components/forms';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';
import { Observable } from 'rxjs';

export interface CourseRegisterFormFields {
    firstName: string;
    lastName: string;
    sportType: string;
    email: string;
    phone: string;
    // Formatted display string ("DD.MM.YYYY (Alter)"), not a raw Date - see
    // CourseRegistrationFormComponent.submit().
    birthday: string;
    isMember: boolean;
    additionalText: string;
    level: string;
    // Resolved from the matching admin-managed course tile (see
    // CourseTilesApiServiceInterface) before submit - never a form control,
    // never user-visible/validated.
    customBccList?: string[];
}

export interface CourseRegisterForm {
    courseRegisterForm: FormGroup;
    formFields: BaseFormElements[];
}

export interface PublicCourseRegistrationInput {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    sportType?: string;
    level?: string;
    notes?: string;
}

@Injectable()
export abstract class CourseRegistrationFormServiceInterface {
    public abstract sendFormToSheetsIo(formData: FormData): void;
    public abstract sendConfirmationMail(mailData: FormToMailInformation<CourseRegisterFormFields>): void;
    // Parallel, non-blocking write into sck-api's course_registrations (see
    // the plan) - does NOT replace sendFormToSheetsIo, which keeps running
    // unconditionally. Only called when a tileId could be resolved (see
    // CourseRegistrationFormComponent's presetTileId).
    public abstract submitPublicRegistration(
        tileId: string,
        input: PublicCourseRegistrationInput,
        turnstileToken: string,
    ): Observable<void>;
    // Public Turnstile site key (environment.turnstileSiteKey) - not a secret, only the
    // sck-api-side secret key needs protecting (see turnstile-middleware.ts).
    public abstract getTurnstileSiteKey(): string;
}
