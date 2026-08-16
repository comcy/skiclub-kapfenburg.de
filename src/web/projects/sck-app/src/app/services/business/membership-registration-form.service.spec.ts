/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MembershipRegisterFormValue } from 'projects/membership-lib/src/lib/ui/membership-registration-form/membership-registration-form.interfaces';
import { environment } from 'projects/sck-app/src/environments/environment';
import { MembershipRegistrationFormService } from './membership-registration-form.service';

const testFormValue: MembershipRegisterFormValue = {
    firstName: 'Max',
    lastName: 'Mustermann',
    birthday: '2000-01-01',
    address: 'Musterstraße 1, 12345 Musterstadt',
    email: 'max@example.com',
    phone: '0123456789',
    isFamilyMembership: false,
    familyMembers: [],
    iban: 'DE12500105170648489890',
    sepaMandateAccepted: true,
    termsAccepted: true,
    privacyAccepted: true,
};

describe('MembershipRegistrationFormService', () => {
    let service: MembershipRegistrationFormService;
    let httpMock: HttpTestingController;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MembershipRegistrationFormService, { provide: MatSnackBar, useValue: snackSpy }],
        });

        service = TestBed.inject(MembershipRegistrationFormService);
        httpMock = TestBed.inject(HttpTestingController);
        snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    });

    afterEach(() => httpMock.verify());

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should POST the form value to /membership/register and open a success snackbar', () => {
        service.submitRegistration(testFormValue);

        const req = httpMock.expectOne(`${environment.sckApiUrl}/membership/register`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(testFormValue);
        req.flush({ message: 'ok', registrationId: 'abc-123' });

        expect(snackBarSpy.open).toHaveBeenCalled();
    });

    it('should open an error snackbar when the registration POST fails', () => {
        service.submitRegistration(testFormValue);

        const req = httpMock.expectOne(`${environment.sckApiUrl}/membership/register`);
        req.error(new ErrorEvent('network-error'));

        expect(snackBarSpy.open).toHaveBeenCalledWith('Fehler beim Speichern des Mitgliedsantrags', 'Ok');
    });
});
