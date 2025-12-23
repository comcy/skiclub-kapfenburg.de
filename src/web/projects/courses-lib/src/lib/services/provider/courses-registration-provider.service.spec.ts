import { TestBed } from '@angular/core/testing';

import { CoursesRegistrationProviderService } from './courses-registration-provider.service';

describe('CoursesRegistrationProviderService', () => {
    let service: CoursesRegistrationProviderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CoursesRegistrationProviderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
