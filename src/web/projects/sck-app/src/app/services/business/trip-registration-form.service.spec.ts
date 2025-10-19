/**
 * Tests for TripRegistrationFormService
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripRegistrationFormService } from './trip-registration-form.service';
import { environment } from 'projects/sck-app/src/environments/environment';
import { getTripConfirmationSuccessMessage } from 'projects/data/mail-templates';

describe('TripRegistrationFormService', () => {
    let service: TripRegistrationFormService;
    let httpMock: HttpTestingController;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        const snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TripRegistrationFormService, { provide: MatSnackBar, useValue: snackSpy }],
        });

        service = TestBed.inject(TripRegistrationFormService);
        httpMock = TestBed.inject(HttpTestingController);
        snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    });

    afterEach(() => httpMock.verify());

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should POST to tripSheetUrl and open success snackbar', () => {
        const formData = new FormData();
        (environment as unknown as { tripSheetUrl: string }).tripSheetUrl = 'https://example.com/trip-sheet';

        service.sendFormToSheetsIo(formData);
        const req = httpMock.expectOne(environment.tripSheetUrl);
        expect(req.request.method).toBe('POST');
        req.flush({ ok: true });
        expect(snackBarSpy.open).toHaveBeenCalledWith(getTripConfirmationSuccessMessage(), 'Ok');
    });

    it('should POST and not open snackbar on error', () => {
        const formData = new FormData();
        (environment as unknown as { tripSheetUrl: string }).tripSheetUrl = 'https://example.com/trip-sheet-error';

        service.sendFormToSheetsIo(formData);
        const req = httpMock.expectOne(environment.tripSheetUrl);
        expect(req.request.method).toBe('POST');
        req.error(new ErrorEvent('network-error'));
        expect(snackBarSpy.open).not.toHaveBeenCalled();
    });
});
