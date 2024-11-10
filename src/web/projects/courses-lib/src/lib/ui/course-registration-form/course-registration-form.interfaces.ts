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
