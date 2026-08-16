/**
 * Tests for GymCoursesRegistrationFormService
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GymCoursesRegistrationFormService } from './gym-courses-registration-form.service';
import { environment } from 'projects/sck-app/src/environments/environment';
import { SnackbarComponent } from 'projects/shared-lib/src/lib/ui-common/components/snackbar/snackbar.component';
import { GymCoursesRegisterFormFields } from 'projects/gym-lib/src/lib/ui/gym-courses-registration-form.interfaces';

describe('GymCoursesRegistrationFormService', () => {
    let service: GymCoursesRegistrationFormService;
    let httpMock: HttpTestingController;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        const snackSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [GymCoursesRegistrationFormService, { provide: MatSnackBar, useValue: snackSpy }],
        });

        service = TestBed.inject(GymCoursesRegistrationFormService);
        httpMock = TestBed.inject(HttpTestingController);
        snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    });

    afterEach(() => httpMock.verify());

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    const testCourse = {
        name: 'Pilates',
        description: '',
        details: '',
        time: '',
        location: '',
        contact: '',
    };

    it('should POST confirmation mail payload and open custom snackbar on success', () => {
        (environment as unknown as { sckApiUrl: string }).sckApiUrl = 'https://api.example.com';
        const formValues: GymCoursesRegisterFormFields = {
            firstName: 'A',
            lastName: 'B',
            birthday: '2000-01-01',
            email: 'a@b.c',
            phone: '1',
            course: testCourse,
            additionalText: 'x',
        };
        const payload = { receiver: 'x@y.z', formValues } as const;
        service.sendConfirmationMail(payload);
        const req = httpMock.expectOne(environment.sckApiUrl + '/send_email');
        expect(req.request.method).toBe('POST');
        req.flush({ ok: true });
        expect(snackBarSpy.openFromComponent).toHaveBeenCalled();
        const args = snackBarSpy.openFromComponent.calls.mostRecent().args as [unknown, { data?: unknown }?];
        expect(args[0]).toBe(SnackbarComponent);
        expect(args[1] && args[1].data).toBeTruthy();
    });

    it('should not open snackbar on error', () => {
        (environment as unknown as { sckApiUrl: string }).sckApiUrl = 'https://api.example.com';
        const formValues: GymCoursesRegisterFormFields = {
            firstName: 'A',
            lastName: 'B',
            birthday: '2000-01-01',
            email: 'a@b.c',
            phone: '1',
            course: testCourse,
            additionalText: 'x',
        };
        const payload = { receiver: 'x@y.z', formValues } as const;
        service.sendConfirmationMail(payload);
        const req = httpMock.expectOne(environment.sckApiUrl + '/send_email');
        expect(req.request.method).toBe('POST');
        req.error(new ErrorEvent('network-error'));
        expect(snackBarSpy.openFromComponent).not.toHaveBeenCalled();
    });
});
