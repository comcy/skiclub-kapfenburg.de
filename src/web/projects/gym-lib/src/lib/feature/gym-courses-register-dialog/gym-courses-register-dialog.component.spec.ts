import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GymCoursesRegisterDialogComponent } from './gym-courses-register-dialog.component';
import { GymCourseDialogData } from './gym-course-register-dialog.interfaces';
import { GymCoursesRegistrationFormServiceInterface } from '../../ui/gym-courses-registration-form.interfaces';

describe('GymCoursesRegisterDialogComponent', () => {
    let component: GymCoursesRegisterDialogComponent;
    let fixture: ComponentFixture<GymCoursesRegisterDialogComponent>;

    beforeEach(async () => {
        const dialogData: GymCourseDialogData = {
            tile: {
                title: 'Test-Kurs',
                date: '2026-01-01',
                course: {
                    name: 'Test-Kurs',
                    description: 'd',
                    details: 'details',
                    time: 't',
                    location: 'l',
                    contact: 'c',
                },
            },
        };

        await TestBed.configureTestingModule({
            imports: [GymCoursesRegisterDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: dialogData },
                { provide: MatDialogRef, useValue: { close: () => undefined } },
                {
                    provide: GymCoursesRegistrationFormServiceInterface,
                    useValue: jasmine.createSpyObj<GymCoursesRegistrationFormServiceInterface>(
                        'GymCoursesRegistrationFormServiceInterface',
                        ['sendConfirmationMail'],
                    ),
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GymCoursesRegisterDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
