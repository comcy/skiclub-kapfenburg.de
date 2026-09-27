/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InfoTile, TileBehavior, TileStatus, TileType } from 'projects/shared-lib/src/lib/ui-common/models';
import { of } from 'rxjs';
import { TripRegistrationFormServiceInterface } from '../../ui/trips-registration-form/trips-registration-form.interfaces';
import { TripsRegisterDialogComponent } from './trips-register-dialog.component';

const TEST_TILE: InfoTile = {
    id: 'info-tile',
    order: 0,
    type: TileType.Info,
    behavior: TileBehavior.View,
    title: 'Info Kachel',
    date: '',
    subTitle: '',
    image: '',
    imageDescription: '',
    description: '',
    details: '',
    status: TileStatus.Open,
    expiration: new Date('2099-01-01'),
};

describe('TripsRegisterDialogComponent', () => {
    let component: TripsRegisterDialogComponent;
    let fixture: ComponentFixture<TripsRegisterDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TripsRegisterDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { tile: TEST_TILE } },
                { provide: MatDialogRef, useValue: { close: () => {} } },
                {
                    provide: TripRegistrationFormServiceInterface,
                    useValue: {
                        sendFormToSheetsIo: () => {},
                        submitPublicRegistration: () => of({ status: 'confirmed' }),
                        getTurnstileSiteKey: () => '1x00000000000000000000AA',
                        getTripPricePreview: () => of({ prices: [], total: 0 }),
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TripsRegisterDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('uses the tile title and date for a non-event (Info) tile without touching tripDetails', () => {
        expect(component.dialogTitle).toBe(TEST_TILE.title);
        expect(component.tripDate).toBe(TEST_TILE.date);
    });
});
