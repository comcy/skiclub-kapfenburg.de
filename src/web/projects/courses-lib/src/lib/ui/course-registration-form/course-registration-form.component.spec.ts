/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRegistrationFormComponent } from './course-registration-form.component';

describe('CourseRegistrationFormComponent', () => {
    let component: CourseRegistrationFormComponent;
    let fixture: ComponentFixture<CourseRegistrationFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseRegistrationFormComponent],
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
});
