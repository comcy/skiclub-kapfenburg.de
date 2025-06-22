import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymCoursesRegistrationComponent } from './gym-courses-registration.component';

describe('GymCoursesRegistrationComponent', () => {
    let component: GymCoursesRegistrationComponent;
    let fixture: ComponentFixture<GymCoursesRegistrationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GymCoursesRegistrationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GymCoursesRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
