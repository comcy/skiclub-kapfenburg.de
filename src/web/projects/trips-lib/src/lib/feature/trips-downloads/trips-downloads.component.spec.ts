/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsDownloadsComponent } from './trips-downloads.component';

describe('TripsDownloadsComponent', () => {
    let component: TripsDownloadsComponent;
    let fixture: ComponentFixture<TripsDownloadsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TripsDownloadsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TripsDownloadsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
