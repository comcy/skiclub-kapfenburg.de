import { Component, OnInit } from '@angular/core';

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
