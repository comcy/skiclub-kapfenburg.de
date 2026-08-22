/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TripTilesApiServiceInterface } from '../../api/trip-tiles-api.interface';
import { TripsRegistrationComponent } from './trips-registration.component';

describe('TripsRegistrationComponent', () => {
    let component: TripsRegistrationComponent;
    let fixture: ComponentFixture<TripsRegistrationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TripsRegistrationComponent],
            providers: [{ provide: TripTilesApiServiceInterface, useValue: { getAllTrips: () => of([]) } }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TripsRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
