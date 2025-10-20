/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsRegistrationFormComponent } from './trips-registration-form.component';

describe('TripsRegistrationFormComponent', () => {
    let component: TripsRegistrationFormComponent;
    let fixture: ComponentFixture<TripsRegistrationFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [TripsRegistrationFormComponent],
}).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TripsRegistrationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
