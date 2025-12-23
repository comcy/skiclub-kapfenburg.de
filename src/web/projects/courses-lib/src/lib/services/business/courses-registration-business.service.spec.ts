import { TestBed } from '@angular/core/testing';

import { CoursesRegistrationBusinessService } from './courses-registration-business.service';

describe('CoursesRegistrationBusinessService', () => {
    let service: CoursesRegistrationBusinessService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CoursesRegistrationBusinessService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
