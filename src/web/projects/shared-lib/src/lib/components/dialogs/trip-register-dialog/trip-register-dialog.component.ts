import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tile } from '../../../models';
import { TripRegistrationFormServiceInterface } from '../../forms/trip-registration-form';

@Component({
  selector: 'lib-trip-register-dialog',
  templateUrl: './trip-register-dialog.component.html',
  styleUrls: ['./trip-register-dialog.component.scss'],
})
export class TripRegisterDialogComponent implements OnInit {
  @Output() public handleConfirmClicked: EventEmitter<boolean> =
    new EventEmitter<boolean>(false);

  public tripTitle: string;
  public tripDate: string;

  constructor(
    private dialogRef: MatDialogRef<TripRegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tile
  ) {
    console.log('DATA >>> ', data);
    this.tripTitle = '';
    this.tripDate = '';
  }

  ngOnInit(): void {
    this.tripTitle = this.data.title;
    this.tripDate = this.data.subTitle;
  }

  public onTripRegistrationFormSubmit(success: boolean): void {
    console.log('SUCCESS >>>> ', success);
    if (success) {
      console.log('SUCCESS clicked >>>> ', success);
      this.handleConfirmClicked.emit(true);
      this.dialogRef.close();
    }
  }
}
