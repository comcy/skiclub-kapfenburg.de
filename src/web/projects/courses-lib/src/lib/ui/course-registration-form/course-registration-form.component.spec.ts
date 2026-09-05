/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CourseRegistrationFormComponent } from './course-registration-form.component';
import { CourseRegistrationFormServiceInterface } from './course-registration-form.interfaces';

describe('CourseRegistrationFormComponent', () => {
    let component: CourseRegistrationFormComponent;
    let fixture: ComponentFixture<CourseRegistrationFormComponent>;

    beforeEach(async () => {
        const mockService = jasmine.createSpyObj<CourseRegistrationFormServiceInterface>(
            'CourseRegistrationFormServiceInterface',
            ['sendFormToSheetsIo', 'submitPublicRegistration', 'getTurnstileSiteKey'],
        );
        mockService.submitPublicRegistration.and.returnValue(of(undefined));
        mockService.getTurnstileSiteKey.and.returnValue('test-site-key');

        await TestBed.configureTestingModule({
            imports: [CourseRegistrationFormComponent],
            providers: [{ provide: CourseRegistrationFormServiceInterface, useValue: mockService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseRegistrationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('computes the price from sportType, birthday and membership status', () => {
        component.skiCoursePricing = {
            childUntilAge: 16,
            snowboard: { adult: { member: 55, nonMember: 70 }, child: { member: 45, nonMember: 60 } },
            alpine: { adult: { member: 60, nonMember: 75 }, child: { member: 50, nonMember: 65 } },
        };

        const adultBirthday = new Date();
        adultBirthday.setFullYear(adultBirthday.getFullYear() - 20);
        component.courseRegisterForm.patchValue({ sportType: 'Snowboard', birthday: adultBirthday, isMember: true });
        expect(component.getPrice()).toBe(55);

        const childBirthday = new Date();
        childBirthday.setFullYear(childBirthday.getFullYear() - 10);
        component.courseRegisterForm.patchValue({ sportType: 'Ski Alpin', birthday: childBirthday, isMember: false });
        expect(component.getPrice()).toBe(65);
    });

    it('returns 0 when pricing or required fields are missing', () => {
        component.skiCoursePricing = null;
        expect(component.getPrice()).toBe(0);
    });
});
