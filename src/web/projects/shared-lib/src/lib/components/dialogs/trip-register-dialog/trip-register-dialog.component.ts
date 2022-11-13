import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Trip } from '../../../domain-models/trip';

@Component({
  selector: 'lib-trip-register-dialog',
  templateUrl: './trip-register-dialog.component.html',
  styleUrls: ['./trip-register-dialog.component.scss'],
})
export class TripRegisterDialogComponent implements OnInit {
  @Output() public handleConfirmClicked: EventEmitter<boolean> =
    new EventEmitter<boolean>(false);

  public dialogTitle!: string;
  public tripDetails$: BehaviorSubject<Trip> = new BehaviorSubject({
    destination: '',
    date: '',
  });
  public tripDetails!: Trip[];
  public boardingList!: string[];

  constructor(
    private dialogRef: MatDialogRef<TripRegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tripDetails$.next({
      destination: data.data.tile.title,
      date: data.data.tile.date,
    });

    this.dialogTitle = `${data.data.tile.title} - ${data.data.tile.date}`;
    this.boardingList = data.data.boardingList;
    this.tripDetails = [
      {
        destination: data.data.tile.title,
        date: data.data.tile.date,
      },
    ];
  }

  ngOnInit(): void {}

  public onTripRegistrationFormSubmit(success: boolean): void {
    if (success) {
      this.handleConfirmClicked.emit(true);
      this.dialogRef.close();
    }
  }
}
