/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MembershipRegistrationFormServiceInterface } from 'projects/membership-lib/src/lib/ui/membership-registration-form/membership-registration-form.interfaces';
import { of, throwError } from 'rxjs';
import { MembershipConfirmComponent } from './membership-confirm.component';

describe('MembershipConfirmComponent', () => {
    let fixture: ComponentFixture<MembershipConfirmComponent>;
    let serviceSpy: jasmine.SpyObj<MembershipRegistrationFormServiceInterface>;

    const setup = (queryParams: Record<string, string>) => {
        TestBed.configureTestingModule({
            imports: [MembershipConfirmComponent],
            providers: [
                { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap(queryParams) } } },
                { provide: MembershipRegistrationFormServiceInterface, useValue: serviceSpy },
            ],
        });
        fixture = TestBed.createComponent(MembershipConfirmComponent);
        fixture.detectChanges();
    };

    beforeEach(() => {
        serviceSpy = jasmine.createSpyObj<MembershipRegistrationFormServiceInterface>(
            'MembershipRegistrationFormServiceInterface',
            ['submitRegistration', 'getTurnstileSiteKey', 'confirmRegistration'],
        );
    });

    it('confirms a valid token and shows success', () => {
        serviceSpy.confirmRegistration.and.returnValue(of(undefined));

        setup({ token: 'valid-token' });

        expect(serviceSpy.confirmRegistration).toHaveBeenCalledWith('valid-token');
        expect(fixture.componentInstance.state).toBe('success');
    });

    it('shows an error when confirmRegistration fails (unknown/expired token)', () => {
        serviceSpy.confirmRegistration.and.returnValue(throwError(() => new Error('404')));

        setup({ token: 'expired-token' });

        expect(fixture.componentInstance.state).toBe('error');
    });

    it('shows an error immediately when no token is present, without calling the backend', () => {
        setup({});

        expect(serviceSpy.confirmRegistration).not.toHaveBeenCalled();
        expect(fixture.componentInstance.state).toBe('error');
    });
});
