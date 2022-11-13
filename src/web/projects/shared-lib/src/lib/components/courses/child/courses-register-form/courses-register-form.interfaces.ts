import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from '../../../base/forms/base.interfaces';

export interface CoursesRegisterForm {
  courseRegisterForm: FormGroup;
  formFields: BaseFormElements[];
}

@Injectable()
export abstract class CoursesRegistrationFormServiceInterface {
  public abstract sendFormToSheetsIo(formData: FormData): void;
}
