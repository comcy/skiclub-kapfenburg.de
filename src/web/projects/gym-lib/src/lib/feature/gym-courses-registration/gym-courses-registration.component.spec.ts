import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymCoursesRegistrationComponent } from './gym-courses-registration.component';
import { GymCoursesRegistrationFormServiceInterface } from '../../ui/gym-courses-registration-form.interfaces';

describe('GymCoursesRegistrationComponent', () => {
    let component: GymCoursesRegistrationComponent;
    let fixture: ComponentFixture<GymCoursesRegistrationComponent>;

    beforeEach(async () => {
        // Embeds lib-gym-courses-registration-form, which injects this token.
        await TestBed.configureTestingModule({
            imports: [GymCoursesRegistrationComponent],
            providers: [
                {
                    provide: GymCoursesRegistrationFormServiceInterface,
                    useValue: jasmine.createSpyObj<GymCoursesRegistrationFormServiceInterface>(
                        'GymCoursesRegistrationFormServiceInterface',
                        ['sendConfirmationMail'],
                    ),
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GymCoursesRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
