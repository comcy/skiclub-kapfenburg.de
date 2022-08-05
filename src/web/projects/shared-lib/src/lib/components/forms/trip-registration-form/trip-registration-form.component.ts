import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
      validationMessage: 'Name is required',
    },
    {
      id: 'lastName',
      label: 'Nachname',
      validationMessage: 'Name is required',
    },
    {
      id: 'email',
      label: 'E-Mail',
      validationMessage: 'Name is required',
    },
    {
      id: 'phone',
      label: 'Telefon',
      validationMessage: 'Name is required',
    },
    {
      id: 'amount',
      label: 'Anzahl der Personen',
      validationMessage: 'Name is required',
    },
    {
      id: 'additionalText',
      label: 'Zusatz',
      validationMessage: 'Name is required',
    },
  ];

  public tripRegisterForm: FormGroup = new FormGroup({
    firstName: new FormControl({ value: null }),
    lastName: new FormControl({ value: null }),
    email: new FormControl({ value: null }),
    phone: new FormControl({ value: null }),
    amount: new FormControl({ value: null }),
    additionalText: new FormControl({ value: null }),
  });

  constructor() {}

  ngOnInit(): void {}

  // getErrorMessage() {
  //   if (this.tripRegisterForm?.get('email').hasError('required')) {
  //     return 'You must enter a value';
  //   }

  //   return this.email.hasError('email') ? 'Not a valid email' : '';
  // }
}
