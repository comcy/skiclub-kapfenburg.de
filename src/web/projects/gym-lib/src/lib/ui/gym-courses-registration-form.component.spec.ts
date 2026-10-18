import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymCoursesRegistrationFormComponent } from './gym-courses-registration-form.component';
import { GymCoursesRegistrationFormServiceInterface } from './gym-courses-registration-form.interfaces';

describe('GymCoursesRegistrationFormComponent', () => {
    let component: GymCoursesRegistrationFormComponent;
    let fixture: ComponentFixture<GymCoursesRegistrationFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GymCoursesRegistrationFormComponent],
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

        fixture = TestBed.createComponent(GymCoursesRegistrationFormComponent);
        component = fixture.componentInstance;
        // additionalData is a required @Input read in ngOnInit.
        component.additionalData = [];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
