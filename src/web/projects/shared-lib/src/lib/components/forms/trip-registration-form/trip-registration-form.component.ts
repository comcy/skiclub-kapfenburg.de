import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TripRegistrationFormServiceInterface } from './trip-registration-form-service.interface';
import { TripRegisterFormElements } from './trip-registration-form.interfaces';

@Component({
  selector: 'lib-trip-registration-form',
  templateUrl: './trip-registration-form.component.html',
  styleUrls: ['./trip-registration-form.component.scss'],
})
export class TripRegistrationFormComponent implements OnInit {
  @Output() onSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  public tripRegisterFormElements: TripRegisterFormElements[] = [
    {
      id: 'firstName',
      label: 'Vorname',
      validation: [{ type: 'required', message: 'is required' }],
      cols: 1,
    },
    {
      id: 'lastName',
      label: 'Nachname',
      validation: [{ type: 'required', message: 'is required' }],
      cols: 1,
    },
    {
      id: 'email',
      label: 'E-Mail',
      validation: [
        { type: 'required', message: 'is required' },
        { type: 'email', message: 'E-Mail is required' },
      ],
      fullWidth: true,
      cols: 2,
    },
    {
      id: 'phone',
      label: 'Telefon',
      validation: [{ type: 'required', message: 'is required' }],
      fullWidth: true,
      cols: 2,
    },
    {
      id: 'amount',
      label: 'Anzahl der Personen',
      validation: [{ type: 'required', message: 'is required' }],
      cols: 1,
    },
    {
      id: 'additionalText',
      label: 'Zusatz',
      validation: [{ type: 'required', message: 'is required' }],
      area: true,
      fullWidth: true,
      cols: 2,
    },
  ];

  public boardingList = ['Westhausen', 'Lauchheim', 'Hülen', 'Ebnat'];

  public tripRegisterForm: FormGroup = this.formBuilder.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    // email: [null, [Validators.required, Validators.email]],
    // phone: [null, [Validators.required]],
    // amount: [null, [Validators.required]],
    // additionalText: [null, [Validators.required]],
    // boardings: [null, [Validators.required]],
  });

  // public tripRegisterForm: FormGroup = new FormGroup({
  //   firstName: new FormControl({ value: 'Hans' }),
  //   lastName: new FormControl({ value: '' }),
  //   email: new FormControl({ value: '' }),
  //   phone: new FormControl({ value: '' }),
  //   amount: new FormControl({ value: '' }),
  //   additionalText: new FormControl({ value: '' }),
  //   halts: new FormControl({ value: '' }),
  // });

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
      this.onSubmit.emit(true);
      this.tripRegistrationFormService.sendFormToSheetsIo(
        this.tripRegisterForm
      );
    }
  }
}
