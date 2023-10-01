/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from 'projects/shared-lib/src/lib/components';

export interface TripRegisterForm {
    tripRegisterForm: FormGroup;
    formFields: BaseFormElements[];
}

@Injectable()
export abstract class TripRegistrationFormServiceInterface {
    public abstract sendFormToSheetsIo(formData: FormData): void;
}
