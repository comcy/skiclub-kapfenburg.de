/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from 'projects/shared-lib/src/lib/components/forms';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';
import { GymCourseInformation } from '../domain';

export interface GymCoursesRegisterFormFields {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthday: string;
    additionalText: string;
    course: GymCourseInformation;
}

export interface GymCoursesRegisterForm {
    gymCoursesRegisterForm: FormGroup;
    formFields: BaseFormElements[];
}

@Injectable()
export abstract class GymCoursesRegistrationFormServiceInterface {
    public abstract sendConfirmationMail(mailData: FormToMailInformation<GymCoursesRegisterFormFields>): void;
}
