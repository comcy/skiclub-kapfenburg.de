import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Price } from '@courses-lib';
import { COURSE_AT_HOME_PRICE_DATA, COURSE_ON_TRAVEL_PRICE_DATA } from '@data';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  constructor() {}

  public courseAtTravelPrice: Price[] = COURSE_ON_TRAVEL_PRICE_DATA;
  public courseAtHomePrice: Price[] = COURSE_AT_HOME_PRICE_DATA;
  public email = new FormControl('', [Validators.required, Validators.email]);

  ngOnInit(): void {}

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  public onCourseRegistrationFormSubmit(success: any): void {
    console.log('SUCCESS >>>> ', success);
    if (success) {
      console.log('SUCCESS clicked >>>> ', success);
    }
  }

}
