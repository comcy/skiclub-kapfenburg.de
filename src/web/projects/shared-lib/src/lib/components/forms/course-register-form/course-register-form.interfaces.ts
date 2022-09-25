import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from '../base/base.interfaces';

export interface CourseRegisterForm {
  courseRegisterForm: FormGroup;
  formFields: BaseFormElements[];
}

@Injectable()
export abstract class CourseRegistrationFormServiceInterface {
  public abstract sendFormToSheetsIo(formData: FormData): void;
}
