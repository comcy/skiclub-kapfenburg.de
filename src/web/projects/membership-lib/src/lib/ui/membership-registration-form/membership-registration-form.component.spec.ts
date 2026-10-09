/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MembershipRegistrationFormComponent } from './membership-registration-form.component';
import { MembershipRegistrationFormServiceInterface } from './membership-registration-form.interfaces';

describe('MembershipRegistrationFormComponent', () => {
    let component: MembershipRegistrationFormComponent;
    let fixture: ComponentFixture<MembershipRegistrationFormComponent>;

    beforeEach(async () => {
        const mockService = jasmine.createSpyObj<MembershipRegistrationFormServiceInterface>(
            'MembershipRegistrationFormServiceInterface',
            ['submitRegistration', 'getTurnstileSiteKey', 'confirmRegistration'],
        );
        mockService.getTurnstileSiteKey.and.returnValue('test-site-key');
        mockService.confirmRegistration.and.returnValue(of(undefined));

        await TestBed.configureTestingModule({
            imports: [MembershipRegistrationFormComponent],
            providers: [{ provide: MembershipRegistrationFormServiceInterface, useValue: mockService }],
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
