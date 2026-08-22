/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TripTilesApiServiceInterface } from '../../api/trip-tiles-api.interface';
import { TripsPricesComponent } from './trips-prices.component';

describe('TripsPricesComponent', () => {
    let component: TripsPricesComponent;
    let fixture: ComponentFixture<TripsPricesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TripsPricesComponent],
            providers: [{ provide: TripTilesApiServiceInterface, useValue: { getAllTrips: () => of([]) } }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TripsPricesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
