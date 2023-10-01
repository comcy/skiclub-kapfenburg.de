/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsPricesComponent } from './trips-prices.component';

describe('TripsPricesComponent', () => {
    let component: TripsPricesComponent;
    let fixture: ComponentFixture<TripsPricesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TripsPricesComponent],
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
