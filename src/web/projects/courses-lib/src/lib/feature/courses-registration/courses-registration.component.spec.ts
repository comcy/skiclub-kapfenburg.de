/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CourseRegistrationFormServiceInterface } from '../../ui/course-registration-form/course-registration-form.interfaces';
import { CoursesRegistrationComponent } from './courses-registration.component';

describe('CoursesRegistrationComponent', () => {
    let component: CoursesRegistrationComponent;
    let fixture: ComponentFixture<CoursesRegistrationComponent>;

    beforeEach(async () => {
        // Embeds lib-course-registration-form, which injects this token.
        const mockService = jasmine.createSpyObj<CourseRegistrationFormServiceInterface>(
            'CourseRegistrationFormServiceInterface',
            ['sendFormToSheetsIo', 'submitPublicRegistration', 'getTurnstileSiteKey'],
        );
        mockService.submitPublicRegistration.and.returnValue(of(undefined));
        mockService.getTurnstileSiteKey.and.returnValue('test-site-key');

        await TestBed.configureTestingModule({
            imports: [CoursesRegistrationComponent],
            providers: [{ provide: CourseRegistrationFormServiceInterface, useValue: mockService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CoursesRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
