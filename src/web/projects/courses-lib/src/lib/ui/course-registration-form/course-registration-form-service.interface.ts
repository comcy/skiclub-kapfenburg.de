/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from 'projects/shared-lib/src/lib/components/forms';

export interface CourseRegisterForm {
    courseRegisterForm: FormGroup;
    formFields: BaseFormElements[];
}

@Injectable()
export abstract class CourseRegistrationFormServiceInterface {
    public abstract sendFormToSheetsIo(formData: FormData): void;
    public abstract sendConfirmationMail(formData: FormData): void;
}
