/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseRegistrationFormService } from './course-registration-form.service';
import { environment } from 'projects/sck-app/src/environments/environment';
import { getCourseConfirmationSuccessMessage } from 'projects/data/mail-templates';

describe('CourseRegistrationFormService', () => {
    let service: CourseRegistrationFormService;
    let httpMock: HttpTestingController;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CourseRegistrationFormService, { provide: MatSnackBar, useValue: snackBarSpyObj }],
        });

        service = TestBed.inject(CourseRegistrationFormService);
        httpMock = TestBed.inject(HttpTestingController);
        snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should POST form data to courseSheetUrl and open success snackbar on next', () => {
        // Arrange
        const formData = new FormData();
        (environment as unknown as { courseSheetUrl: string }).courseSheetUrl = 'https://example.com/sheet';

        // Act
        service.sendFormToSheetsIo(formData);

        const req = httpMock.expectOne(environment.courseSheetUrl);
        expect(req.request.method).toBe('POST');
        req.flush({ ok: true });

        // Assert
        expect(snackBarSpy.open).toHaveBeenCalledWith(getCourseConfirmationSuccessMessage(), 'Ok');
    });

    it('should POST form data and NOT open snackbar on error (only log)', () => {
        const formData = new FormData();
        (environment as unknown as { courseSheetUrl: string }).courseSheetUrl = 'https://example.com/sheet-error';
        service.sendFormToSheetsIo(formData);
        const req = httpMock.expectOne(environment.courseSheetUrl);
        expect(req.request.method).toBe('POST');
        req.error(new ErrorEvent('network-error'));
        expect(snackBarSpy.open).not.toHaveBeenCalled();
    });
});
