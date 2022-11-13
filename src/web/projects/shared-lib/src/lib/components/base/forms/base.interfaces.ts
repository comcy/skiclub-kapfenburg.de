export interface BaseFormElements {
  id: string;
  label: string;
  validation: BaseFormFieldValidation[];
  placehiolder?: string;
  fullWidth?: boolean;
  area?: boolean;
  cols?: number;
}

export interface BaseFormFieldValidation {
  type: string;
  message: string;
}
