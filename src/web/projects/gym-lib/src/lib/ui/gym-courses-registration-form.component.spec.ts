import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymCoursesRegistrationFormComponent } from './gym-courses-registration-form.component';

describe('GymCoursesRegistrationFormComponent', () => {
    let component: GymCoursesRegistrationFormComponent;
    let fixture: ComponentFixture<GymCoursesRegistrationFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GymCoursesRegistrationFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GymCoursesRegistrationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
