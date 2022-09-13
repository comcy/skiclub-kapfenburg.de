import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TRIP_REGISTER_FORM_ELEMENTS } from './trip-register-form-fields';
import { TripRegistrationFormServiceInterface } from './trip-registration-form-service.interface';
import { TripRegisterFormElements } from './trip-registration-form.interfaces';

@Component({
  selector: 'lib-trip-registration-form',
  templateUrl: './trip-registration-form.component.html',
  styleUrls: ['./trip-registration-form.component.scss'],
})
export class TripRegistrationFormComponent implements OnInit {
  @Output() onSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  public boardingList = ['Westhausen', 'Lauchheim', 'Hülen', 'Ebnat'];

  public tripRegisterForm: FormGroup = this.formBuilder.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required]],
    amount: [null, [Validators.required]],
    additionalText: [null, [Validators.required]],
    boardings: [null, [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private tripRegistrationFormService: TripRegistrationFormServiceInterface
  ) {}

  ngOnInit(): void {}

  public hasError(field: string): boolean {
    // TODO Generalize error messages
    // const foundField = this.tripRegisterFormElements.find((f) => {
    //   return field === f.id;
    // })?.validation;

    const emailError = this.tripRegisterForm
      .get(field)
      ?.hasError('email') as boolean;

    const requiredError = this.tripRegisterForm.get(field)?.value;

    return emailError && requiredError;
  }

  public isSubmitDisabled(): boolean {
    if (this.tripRegisterForm.valid) {
      return false;
    }
    return true;
  }

  public submit(): void {
    if (this.tripRegisterForm.valid) {
      let formData: any = new FormData();
      for (let field of TRIP_REGISTER_FORM_ELEMENTS) {
        console.log('FIELD >>> ', field);
        formData.append('field.id', this.tripRegisterForm.get(field.id)?.value);
      }
      if (formData) {
        this.onSubmit.emit(true);
        this.tripRegistrationFormService.sendFormToSheetsIo(formData);
      } else {
        console.error('No data provided');
      }
    }
  }
}
