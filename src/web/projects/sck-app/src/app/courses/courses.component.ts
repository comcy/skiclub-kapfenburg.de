import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Price } from '@courses-lib';
import { COURSE_AT_HOME_PRICE_DATA, COURSE_ON_TRAVEL_PRICE_DATA } from '@data';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  public navLinks = [
    {
      label: 'Anmeldung',
      link: './registration',
    },
    {
      label: 'Information',
      link: './information',
    },
    {
      label: 'Preise',
      link: './prices',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
