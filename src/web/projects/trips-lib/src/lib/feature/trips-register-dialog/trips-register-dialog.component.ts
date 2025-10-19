/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Trip } from '../../domain/models';
import { DialogData } from './trip-register-dialog.interfaces';
import { NgIf, AsyncPipe } from '@angular/common';
import { BaseDialogComponent } from '../../../../../shared-lib/src/lib/components/dialogs/base-dialog/base-dialog.component';
import { TripsRegistrationFormComponent } from '../../ui/trips-registration-form/trips-registration-form.component';

@Component({
    selector: 'lib-trips-register-dialog',
    templateUrl: './trips-register-dialog.component.html',
    styleUrls: ['./trips-register-dialog.component.scss'],
    imports: [
        NgIf,
        BaseDialogComponent,
        TripsRegistrationFormComponent,
        AsyncPipe,
    ],
})
export class TripsRegisterDialogComponent implements OnInit {
    @Output() public handleConfirmClicked: EventEmitter<boolean> = new EventEmitter<boolean>(false);

    public dialogTitle!: string;
    public tripDate!: string;
    public tripDetails$: BehaviorSubject<Trip[]> = new BehaviorSubject([
        {
            destination: '',
            date: '',
            boarding: [''],
        },
    ]);
    public tripDetails!: Trip[];
    public boardingList!: string[];

    constructor(
        private dialogRef: MatDialogRef<TripsRegisterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}

    ngOnInit(): void {
        const tile = this.data.tile;

        this.dialogTitle = `${tile.title}`;
        this.tripDate = `${tile.date}`;

        this.tripDetails$.next([
            {
                destination: tile.title,
                date: tile.date,
                boarding: tile.boardings,
            },
        ]);

        this.tripDetails = [
            {
                destination: tile.title,
                date: tile.date,
                boarding: tile.boardings,
            },
        ];
    }

    public onTripRegistrationFormSubmit(success: boolean): void {
        if (success) {
            this.handleConfirmClicked.emit(true);
            this.dialogRef.close();
        }
    }
}
