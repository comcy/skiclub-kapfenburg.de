import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Price } from 'projects/shared-lib/src/lib/models';
import {
  COURSE_AT_HOME_PRICE_DATA,
  COURSE_ON_TRAVEL_PRICE_DATA,
} from '../../price-data';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  public courseAtTravelPrice: Price[] = COURSE_ON_TRAVEL_PRICE_DATA;
  public courseAtHomePrice: Price[] = COURSE_AT_HOME_PRICE_DATA;

  constructor() {}

  ngOnInit(): void {}

  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  public onCourseRegistrationFormSubmit(success: boolean): void {
    console.log('SUCCESS >>>> ', success);
    if (success) {
      console.log('SUCCESS clicked >>>> ', success);
    }
  }
}
