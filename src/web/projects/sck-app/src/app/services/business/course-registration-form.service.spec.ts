/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseRegistrationFormService } from './course-registration-form.service';

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

    it('should send form data to sheets.io and show success message', () => {
        const formData = new FormData();
        service.sendFormToSheetsIo(formData);

        const req = httpMock.expectOne(`${service['sheetUrl']}`);
        expect(req.request.method).toBe('POST');
        req.flush({});

        expect(snackBarSpy.open).toHaveBeenCalledWith(service['successMessage'], service['snackAction']);
    });

    it('should send form data to sheets.io and show error message', () => {
        const formData = new FormData();
        service.sendFormToSheetsIo(formData);

        const req = httpMock.expectOne(`${service['sheetUrl']}`);
        expect(req.request.method).toBe('POST');
        req.error(new ErrorEvent('network error'));

        expect(snackBarSpy.open).toHaveBeenCalledWith(service['errorMessage'], service['snackAction']);
    });
});
