import { FormGroup } from '@angular/forms';
import { BaseFormElements } from '../base/base.interfaces';

export interface TripRegisterForm {
  tripRegisterForm: FormGroup;
  formFields: BaseFormElements[];
}
