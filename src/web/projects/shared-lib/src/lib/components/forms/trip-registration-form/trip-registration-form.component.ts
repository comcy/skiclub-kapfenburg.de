import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Trip } from '../../../models/trip';
import { BaseRegistrationFormServiceInterface } from '../base/base.interfaces';
import { TRIP_REGISTER_FORM_ELEMENTS } from './trip-register-form-fields';

@Component({
  selector: 'lib-trip-registration-form',
  templateUrl: './trip-registration-form.component.html',
  styleUrls: ['./trip-registration-form.component.scss'],
})
export class TripRegistrationFormComponent implements OnInit {
  @Input() public additionalData$!: BehaviorSubject<Trip[]>;
  @Input() public additionalData!: Trip[];
  @Output() onSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  public boardingList = ['Westhausen', 'Lauchheim', 'Hülen', 'Ebnat'];

  public tripView!: string;

  public tripRegisterForm: FormGroup = this.formBuilder.group({
    trip: [null, [Validators.required]],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required]],
    amount: [null, [Validators.required]],
    additionalText: [null, [Validators.required]],
    boarding: [null, [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private tripRegistrationFormService: BaseRegistrationFormServiceInterface
  ) {}

  ngOnInit(): void {
    if (this.additionalData.length === 1) {
      this.tripRegisterForm.patchValue({ trip: this.additionalData[0] });
    }
  }

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
        if (field.id === 'trip') {
          const tripValue = this.tripRegisterForm.get(field.id)?.value;
          formData.append('destination', tripValue.destination);
          formData.append('date', tripValue.date);
        }
        formData.append(field.id, this.tripRegisterForm.get(field.id)?.value);
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
