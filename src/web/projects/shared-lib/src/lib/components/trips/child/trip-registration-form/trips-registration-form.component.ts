import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Trip } from '../../../../domain-models/trip';
import { BreakpointObserverService } from '../../../../services';
import { TRIP_REGISTER_FORM_ELEMENTS } from './trips-register-form-fields';
import { TripRegistrationFormServiceInterface } from './trips-registration-form.interfaces';

@Component({
  selector: 'lib-trips-registration-form',
  templateUrl: './trips-registration-form.component.html',
  styleUrls: ['./trips-registration-form.component.scss'],
})
export class TripsRegistrationFormComponent implements OnInit {
  @Input() public additionalData$!: BehaviorSubject<Trip[]>;
  @Input() public additionalData!: Trip[];
  @Input() public boardingList!: string[];
  @Output() onSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isSending: boolean = false;
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
    private tripRegistrationFormService: TripRegistrationFormServiceInterface,
    public breakpointObserver: BreakpointObserverService
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
    this.isSending = true;
    if (this.tripRegisterForm.valid) {
      const formData: FormData = new FormData();
      // Add form group data to form data
      const timestamp = Date.now();
      formData.append('timestamp', new Date(timestamp).toLocaleString());
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
        this.isSending = false;
      } else {
        console.error('No data provided');
      }
    }
  }
}
