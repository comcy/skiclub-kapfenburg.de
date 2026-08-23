/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from 'projects/shared-lib/src/lib/components/forms';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';

export interface CourseRegisterFormFields {
    firstName: string;
    lastName: string;
    sportType: string;
    email: string;
    phone: string;
    age: string;
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

@Injectable()
export abstract class CourseRegistrationFormServiceInterface {
    public abstract sendFormToSheetsIo(formData: FormData): void;
    public abstract sendConfirmationMail(mailData: FormToMailInformation<CourseRegisterFormFields>): void;
}
