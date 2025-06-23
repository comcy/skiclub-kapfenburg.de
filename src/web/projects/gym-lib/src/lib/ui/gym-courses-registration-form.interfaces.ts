/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from 'projects/shared-lib/src/lib/components/forms';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';

export interface GymCoursesRegisterFormFields {
    firstName: string;
    lastName: string;
    courseType: string;
    email: string;
    phone: string;
    age: string;
    additionalText: string;
}

export interface GymCoursesRegisterForm {
    gymCoursesRegisterForm: FormGroup;
    formFields: BaseFormElements[];
}

@Injectable()
export abstract class GymCoursesRegistrationFormServiceInterface {
    public abstract sendConfirmationMail(mailData: FormToMailInformation<GymCoursesRegisterFormFields>): void;
}
