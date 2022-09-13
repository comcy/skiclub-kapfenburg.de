import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TRIP_REGISTER_FORM_ELEMENTS } from './trip-register-form-fields';
import { TripRegistrationFormServiceInterface } from './trip-registration-form-service.interface';
import { TripDetails } from './trip-registration-form.interfaces';

@Component({
  selector: 'lib-trip-registration-form',
  templateUrl: './trip-registration-form.component.html',
  styleUrls: ['./trip-registration-form.component.scss'],
})
export class TripRegistrationFormComponent implements OnInit {
  @Input() public additionalData$!: BehaviorSubject<TripDetails>;
  @Input() public additionalData!: TripDetails;
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
      const formData: FormData = new FormData();
      // Add form group data to form data
      for (let field of TRIP_REGISTER_FORM_ELEMENTS) {
        formData.append(field.id, this.tripRegisterForm.get(field.id)?.value);
      }

      // Add trip destination and trip date to form data
      for (let key of ['destination', 'date']) {
        formData.append(key, this.additionalData[key as keyof TripDetails]);
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
