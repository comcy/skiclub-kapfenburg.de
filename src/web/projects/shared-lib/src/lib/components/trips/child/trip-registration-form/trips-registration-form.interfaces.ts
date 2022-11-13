import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from '../../../base/forms/base.interfaces';

export interface TripRegisterForm {
  tripRegisterForm: FormGroup;
  formFields: BaseFormElements[];
}

@Injectable()
export abstract class TripRegistrationFormServiceInterface {
  public abstract sendFormToSheetsIo(formData: FormData): void;
}
