import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss'],
})
export class TripsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  public onTripRegistrationFormSubmit(success: boolean): void {
    console.log('SUCCESS >>>> ', success);
    if (success) {
      console.log('SUCCESS clicked >>>> ', success);
    }
  }
}
