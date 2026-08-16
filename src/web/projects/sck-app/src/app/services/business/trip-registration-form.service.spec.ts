/**
 * Tests for TripRegistrationFormService
 */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripRegistrationFormService } from './trip-registration-form.service';
import { environment } from 'projects/sck-app/src/environments/environment';
import { getTripConfirmationSuccessMessage } from 'projects/data/mail-templates';
import { SheetDbRow } from 'projects/trips-lib/src/lib/ui/trips-registration-form/trips-registration-form.interfaces';

const testRows: SheetDbRow[] = [
    {
        destination: 'Testort',
        date: '2026-01-01',
        firstName: 'A',
        lastName: 'B',
        birthday: '2000-01-01',
        email: 'a@b.c',
        phone: '1',
        boarding: 'Teststation',
        additionalText: '',
    },
];

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
        (environment as unknown as { tripSheetUrl: string }).tripSheetUrl = 'https://example.com/trip-sheet';

        service.sendFormToSheetsIo(testRows);
        const req = httpMock.expectOne(environment.tripSheetUrl);
        expect(req.request.method).toBe('POST');
        req.flush({ ok: true });
        expect(snackBarSpy.open).toHaveBeenCalledWith(getTripConfirmationSuccessMessage(), 'Ok');
    });

    it('should POST and open an error snackbar on error', () => {
        (environment as unknown as { tripSheetUrl: string }).tripSheetUrl = 'https://example.com/trip-sheet-error';

        service.sendFormToSheetsIo(testRows);
        const req = httpMock.expectOne(environment.tripSheetUrl);
        expect(req.request.method).toBe('POST');
        req.error(new ErrorEvent('network-error'));
        expect(snackBarSpy.open).toHaveBeenCalledWith('Fehler beim Speichern der Anmeldung', 'Ok');
    });
});
