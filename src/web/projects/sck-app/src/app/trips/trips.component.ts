import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss'],
})
export class TripsComponent implements OnInit {
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
    {
      label: 'Downloads',
      link: './downloads',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
