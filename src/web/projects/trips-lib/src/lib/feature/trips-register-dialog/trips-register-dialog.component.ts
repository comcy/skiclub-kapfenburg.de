import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Trip } from '../../domain/models';

@Component({
  selector: 'lib-trips-register-dialog',
  templateUrl: './trips-register-dialog.component.html',
  styleUrls: ['./trips-register-dialog.component.scss'],
})
export class TripsRegisterDialogComponent implements OnInit {
  @Output() public handleConfirmClicked: EventEmitter<boolean> =
    new EventEmitter<boolean>(false);

  public dialogTitle!: string;
  public tripDetails$: BehaviorSubject<Trip> = new BehaviorSubject({
    destination: '',
    date: '',
    boarding: [''],
  });
  public tripDetails!: Trip[];
  public boardingList!: string[];

  constructor(
    private dialogRef: MatDialogRef<TripsRegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tripDetails$.next({
      destination: data.data.tile.title,
      date: data.data.tile.date,
      boarding: [],
    });

    this.dialogTitle = `${data.data.tile.title} - ${data.data.tile.date}`;
    this.boardingList = data.data.boardingList;
    this.tripDetails = [
      {
        destination: data.data.tile.title,
        date: data.data.tile.date,
        boarding: [],
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
