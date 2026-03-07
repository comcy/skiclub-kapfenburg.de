/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { BaseDialogComponent } from '../../../../../shared-lib/src/lib/components/dialogs/base-dialog/base-dialog.component';
import { EventTile, TileType } from '../../../../../shared-lib/src/lib/ui-common/models';
import { Trip } from '../../domain/models/trip-base';
import { TripsRegistrationFormComponent } from '../../ui/trips-registration-form/trips-registration-form.component';
import { DialogData } from './trip-register-dialog.interfaces';

@Component({
    selector: 'lib-trips-register-dialog',
    templateUrl: './trips-register-dialog.component.html',
    styleUrls: ['./trips-register-dialog.component.scss'],
    standalone: true,
    imports: [NgIf, BaseDialogComponent, TripsRegistrationFormComponent, AsyncPipe],
})
export class TripsRegisterDialogComponent implements OnInit {
    @Output() public handleConfirmClicked: EventEmitter<boolean> = new EventEmitter<boolean>(false);
    public dialogTitle!: string;
    public tripDate!: string;
    public tripDetails$: BehaviorSubject<Trip[]> = new BehaviorSubject([
        {
            destination: '',
            date: '',
            availableBoardings: [''],
        },
    ]);
    public tripDetails!: Trip[];
    public boardingList!: string[];
    public data = inject<DialogData>(MAT_DIALOG_DATA);

    private dialogRef = inject<MatDialogRef<TripsRegisterDialogComponent>>(MatDialogRef);

    ngOnInit(): void {
        const tile = this.data.tile;

        this.dialogTitle = `${tile.title}`;
        this.tripDate = `${tile.date}`;

        if (tile.type === TileType.Event) {
            const eventTile = tile as EventTile;
            this.tripDetails = [
                {
                    destination: eventTile.title,
                    date: eventTile.date,
                    availableBoardings: eventTile.boardings ?? [],
                    tripConfig: eventTile.tripConfig,
                },
            ];
            this.tripDetails$.next(this.tripDetails);
        }
    }

    public onTripRegistrationFormSubmit(success: boolean): void {
        if (success) {
            this.handleConfirmClicked.emit(true);
            this.dialogRef.close();
        }
    }
}
