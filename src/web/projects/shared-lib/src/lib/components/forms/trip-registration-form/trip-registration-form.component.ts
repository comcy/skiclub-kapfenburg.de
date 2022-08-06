import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
} from '@angular/forms';
import { id } from 'date-fns/locale';
import { TripRegisterFormElements } from './trip-register-form.interfaces';

@Component({
  selector: 'lib-trip-registration-form',
  templateUrl: './trip-registration-form.component.html',
  styleUrls: ['./trip-registration-form.component.scss'],
})
export class TripRegistrationFormComponent implements OnInit {
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

  public haltList = ['Westhausen', 'Lauchheim', 'Hülen', 'Ebnat'];

  public tripRegisterForm = this.formBuilder.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required]],
    amount: [null, [Validators.required]],
    additionalText: [null, [Validators.required]],
    halts: [null, [Validators.required]],
  });

  // public tripRegisterForm: FormGroup = new FormGroup({
  //   firstName: new FormControl({ value: 'Hans' }),
  //   lastName: new FormControl({ value: '' }),
  //   email: new FormControl({ value: '' }),
  //   phone: new FormControl({ value: '' }),
  //   amount: new FormControl({ value: '' }),
  //   additionalText: new FormControl({ value: '' }),
  //   halts: new FormControl({value: ''})
  // });

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {}

  public hasError(field: string): boolean {

    // TODO Generalize error messages
    const foundField = this.tripRegisterFormElements.find(f => {return field === f.id})?.validation;

    const emailError = this.tripRegisterForm
      .get(field)
      ?.hasError('email') as boolean;

      const requiredError = this.tripRegisterForm
      .get(field)?.value;

    return emailError && requiredError;
  }

  public submit(): void {
    if (this.tripRegisterForm.valid) {
      const values = this.tripRegisterForm.getRawValue();
    }
  }
}
