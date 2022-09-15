import { Component, OnInit } from '@angular/core';
import { Trip } from 'projects/shared-lib/src/lib/models/trip';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss'],
})
export class TripsComponent implements OnInit {
  public trips: Trip[] = [
    {
      destination: 'Lermoos',
      date: '15.01.2023',
    },
    {
      destination: 'B',
      date: '12.02.2023',
    },
    {
      destination: 'C',
      date: '12.04.2024',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  public onTripRegistrationFormSubmit(success: boolean): void {
    console.log('SUCCESS >>>> ', success);
    if (success) {
      console.log('SUCCESS clicked >>>> ', success);
    }
  }
}
