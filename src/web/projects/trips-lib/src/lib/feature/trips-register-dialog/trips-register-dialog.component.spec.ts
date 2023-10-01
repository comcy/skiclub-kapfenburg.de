/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsRegisterDialogComponent } from './trips-register-dialog.component';

describe('TripsRegisterDialogComponent', () => {
    let component: TripsRegisterDialogComponent;
    let fixture: ComponentFixture<TripsRegisterDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TripsRegisterDialogComponent],
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
});
