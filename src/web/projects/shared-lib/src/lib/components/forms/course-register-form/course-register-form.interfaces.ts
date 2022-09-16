import { FormGroup } from '@angular/forms';
import { BaseFormElements } from '../base/base.interfaces';

export interface CourseRegisterForm {
  courseRegisterForm: FormGroup;
  formFields: BaseFormElements[];
}
