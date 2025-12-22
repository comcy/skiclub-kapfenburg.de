/**
 * @copyright Copyright (c) 2019 - 2024 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from 'projects/shared-lib/src/lib/components';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';
import { Trip, TripParticipant } from '../../domain/models';

export interface TripRegisterForm {
    tripRegisterForm: FormGroup;
    formFields: BaseFormElements[];
}

export interface TripRegisterFormValue {
    trip: Trip;
    additionalText: string;
    participants: TripParticipant[];
}

export type SheetDbRow = Omit<Trip, 'availableBoardings'> &
    TripParticipant & {
        age?: number;
        additionalText: string;
        timestamp?: string;
    };

@Injectable()
export abstract class TripRegistrationFormServiceInterface {
    public abstract sendFormToSheetsIo(rows: SheetDbRow[]): void;
    public abstract sendConfirmationMail(mailData: FormToMailInformation<TripRegisterFormValue>): void;
}
