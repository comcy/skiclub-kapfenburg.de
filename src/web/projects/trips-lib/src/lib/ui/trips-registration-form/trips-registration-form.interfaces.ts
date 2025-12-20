/**
 * @copyright Copyright (c) 2019 - 2024 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from 'projects/shared-lib/src/lib/components';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';
import { Trip } from '../../domain/models';

export interface TripRegisterForm {
    tripRegisterForm: FormGroup;
    formFields: BaseFormElements[];
}

export interface TripRegisterParticipant {
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
    phone: string;
    boarding: string;
}

export interface TripRegisterFormFields {
    trip: Trip;
    additionalText: string;
    participants: TripRegisterParticipant[];
}

@Injectable()
export abstract class TripRegistrationFormServiceInterface {
    public abstract sendFormToSheetsIo(formData: FormData): void;
    public abstract sendConfirmationMail(mailData: FormToMailInformation<TripRegisterFormFields>): void;
}
