import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { TripDetails } from '../../forms/trip-registration-form';

@Component({
  selector: 'lib-trip-register-dialog',
  templateUrl: './trip-register-dialog.component.html',
  styleUrls: ['./trip-register-dialog.component.scss'],
})
export class TripRegisterDialogComponent implements OnInit {
  @Output() public handleConfirmClicked: EventEmitter<boolean> =
    new EventEmitter<boolean>(false);

  public tripDetails$: BehaviorSubject<TripDetails> = new BehaviorSubject({
    destination: '',
    date: '',
  });
  public dialogTitle!: string;
  public tripDetails!: TripDetails;

  constructor(
    private dialogRef: MatDialogRef<TripRegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tripDetails$.next({
      destination: data.data.tile.title,
      date: data.data.tile.date,
    });

    this.dialogTitle = `${data.data.tile.title} - ${data.data.tile.date}`;

    this.tripDetails = {
      destination: data.data.tile.title,
      date: data.data.tile.date,
    };
  }

  ngOnInit(): void {}

  public onTripRegistrationFormSubmit(success: boolean): void {
    console.log('SUCCESS >>>> ', success);
    if (success) {
      console.log('SUCCESS clicked >>>> ', success);
      this.handleConfirmClicked.emit(true);
      this.dialogRef.close();
    }
  }
}
