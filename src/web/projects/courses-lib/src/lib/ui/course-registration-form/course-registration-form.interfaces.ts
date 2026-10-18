/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from 'projects/shared-lib/src/lib/components/forms';
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
    // silent=true suppresses the built-in confirmation snackbar - used
    // whenever presetTileId is set, since submitPublicRegistration below is
    // then the real, reliable record and drives the user-facing message
    // instead (a failed Sheets mirror write must never look like a failed
    // registration). No presetTileId (no admin course tiles exist at all,
    // see #183) has no such fallback, so it keeps relying on this call's own
    // snackbar, same as before #182.
    public abstract sendFormToSheetsIo(formData: FormData, silent?: boolean): void;
    // Parallel, non-blocking write into sck-api's course_registrations (see
    // the plan). Only called when a tileId could be resolved (see
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
