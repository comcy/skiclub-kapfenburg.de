/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipRegistrationFormComponent } from './membership-registration-form.component';

describe('MembershipRegistrationFormComponent', () => {
    let component: MembershipRegistrationFormComponent;
    let fixture: ComponentFixture<MembershipRegistrationFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MembershipRegistrationFormComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MembershipRegistrationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
