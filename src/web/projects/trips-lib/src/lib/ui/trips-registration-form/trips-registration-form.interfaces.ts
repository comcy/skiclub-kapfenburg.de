/**
 * @copyright Copyright (c) 2019 - 2024 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from 'projects/shared-lib/src/lib/components';
import { MailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';

export interface TripRegisterForm {
    tripRegisterForm: FormGroup;
    formFields: BaseFormElements[];
}

export interface TripRegisterFormFields {
    trip: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    amount: string;
    additionalText: string;
    boarding: string;
}

@Injectable()
export abstract class TripRegistrationFormServiceInterface {
    public abstract sendFormToSheetsIo(formData: FormData): void;
    public abstract sendConfirmationMail(mailData: MailInformation): void;
}
