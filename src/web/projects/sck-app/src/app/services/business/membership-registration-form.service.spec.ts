/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getMembershipConfirmationSuccessMessage } from 'projects/data/mail-templates';
import { MembershipRegistrationPayload } from 'projects/membership-lib/src/lib/ui/membership-registration-form/membership-registration-form.interfaces';
import { environment } from 'projects/sck-app/src/environments/environment';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';
import { MembershipRegistrationFormService } from './membership-registration-form.service';

const testPayload: MembershipRegistrationPayload = {
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
    declarationAccepted: true,
    privacyAccepted: true,
    timestamp: '2026-01-01T00:00:00.000Z',
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

    it('should POST the registration payload to /register/membership and open success snackbar', () => {
        service.submitRegistration(testPayload);

        const req = httpMock.expectOne(`${environment.sckApiUrl}/register/membership`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(testPayload);
        req.flush({ ok: true });

        expect(snackBarSpy.open).toHaveBeenCalledWith(getMembershipConfirmationSuccessMessage(), 'Ok');
    });

    it('should open an error snackbar when the registration POST fails', () => {
        service.submitRegistration(testPayload);

        const req = httpMock.expectOne(`${environment.sckApiUrl}/register/membership`);
        req.error(new ErrorEvent('network-error'));

        expect(snackBarSpy.open).toHaveBeenCalledWith('Fehler beim Speichern des Mitgliedsantrags', 'Ok');
    });

    it('should send the applicant confirmation mail including the IBAN', () => {
        const mailData: FormToMailInformation<typeof testPayload> = {
            receiver: testPayload.email,
            formValues: testPayload,
        };

        service.sendConfirmationMail(mailData);

        const req = httpMock.expectOne(`${environment.sckApiUrl}/send_email`);
        expect(req.request.body.to).toBe(testPayload.email);
        expect(req.request.body.text).toContain(testPayload.iban);
        req.flush({ ok: true });
    });

    it('should send the board notification mail to the fixed recipient list without the IBAN', () => {
        const mailData: FormToMailInformation<typeof testPayload> = {
            receiver: testPayload.email,
            formValues: testPayload,
        };

        service.sendBoardNotificationMail(mailData);

        const req = httpMock.expectOne(`${environment.sckApiUrl}/send_email`);
        expect(req.request.body.to).toContain('registration@skiclub-kapfenburg.de');
        expect(req.request.body.text).not.toContain(testPayload.iban);
        req.flush({ ok: true });
    });
});
