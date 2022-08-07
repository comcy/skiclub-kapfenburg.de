import { FormGroup } from '@angular/forms';

export interface TripRegisterForm {
  tripRegisterForm: FormGroup;
  formFields: TripRegisterFormElements[];
}

export interface TripRegisterFormElements {
  id: string;
  label: string;
  validation: FormFieldValidation[];
  placehiolder?: string;
  fullWidth?: boolean;
  area?: boolean;
  cols?: number
}

export interface FormFieldValidation {
  type: string;
  message: string;
}
