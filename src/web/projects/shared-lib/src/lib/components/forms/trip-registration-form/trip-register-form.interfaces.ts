import { FormGroup } from '@angular/forms';

export interface TripRegisterForm {
  tripRegisterForm: FormGroup;
  formFields: TripRegisterFormElements[];
}

export interface TripRegisterFormElements {
  id: string;
  label: string;
  validationMessage?: string;
  placehiolder?: string;
}
