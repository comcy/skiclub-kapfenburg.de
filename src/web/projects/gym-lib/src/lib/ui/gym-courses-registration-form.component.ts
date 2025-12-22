import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BreakpointObserverService } from '@shared/ui-common';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';
import { TripRegistrationFormServiceInterface } from 'projects/trips-lib/src/lib/ui/trips-registration-form/trips-registration-form.interfaces';
import { GymCourse } from '../domain';
import { GYM_COURSES_REGISTRATION_FORM_ELEMENTS } from './gym-courses-registration-form-fields';
import {
    GymCoursesRegisterFormFields,
    GymCoursesRegistrationFormServiceInterface,
} from './gym-courses-registration-form.interfaces';
import { GERMAN_DATE_FORMATS } from 'projects/shared-lib/src/lib/locale';

@Component({
    selector: 'lib-gym-courses-registration-form',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        MatSelectModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
    ],
    providers: [
        provideNativeDateAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
    ],
    templateUrl: './gym-courses-registration-form.component.html',
    styleUrl: './gym-courses-registration-form.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GymCoursesRegistrationFormComponent implements OnInit, OnChanges {
    @Input() public additionalData!: GymCourse[];
    @Output() submitForm: EventEmitter<boolean> = new EventEmitter<boolean>();

    public breakpointObserver = inject(BreakpointObserverService);
    public gymCoursesRegisterForm: FormGroup = new FormGroup({});
    public courseList: string[] = [];

    private formBuilder = inject(FormBuilder);
    private gymCoursesRegistrationFormService = inject(GymCoursesRegistrationFormServiceInterface);
    private tripRegistrationFormService = inject(TripRegistrationFormServiceInterface);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.gymCoursesRegisterForm = this.formBuilder.group({
            courseType: [null, [Validators.required]],
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            phone: [null, [Validators.required]],
            birthday: [null, [Validators.required]],
            additionalText: [null, []],
        });

        if (this.additionalData.length === 1) {
            this.gymCoursesRegisterForm.patchValue({
                courseType: this.additionalData[0],
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['additionalData'] && this.additionalData) {
            this.courseList = this.additionalData.map((course) => `${course.name}: ${course.date}`);
            this.gymCoursesRegisterForm.patchValue({
                courseType: this.courseList[0],
            });
            this.cdr.markForCheck();
        } else {
            const course = this.additionalData.map((course) => `${course.name}: ${course.date}`);
            this.gymCoursesRegisterForm.patchValue({
                courseType: course[0],
            });
        }
    }

    public hasError(field: string): boolean {
        const emailError = this.gymCoursesRegisterForm.get(field)?.hasError('email') as boolean;
        const requiredError = this.gymCoursesRegisterForm.get(field)?.value;

        return emailError && requiredError;
    }

    public isSubmitDisabled(): boolean {
        if (this.gymCoursesRegisterForm.valid) {
            return false;
        }
        return true;
    }

    public submit(): void {
        if (this.gymCoursesRegisterForm.valid) {
            const formData: FormData = new FormData();
            // Add form group data to form data
            const timestamp = Date.now();
            formData.append('timestamp', new Date(timestamp).toLocaleString());
            for (const field of GYM_COURSES_REGISTRATION_FORM_ELEMENTS) {
                formData.append(field.id, this.gymCoursesRegisterForm.get(field.id)?.value);
            }

            if (formData) {
                this.submitForm.emit(true);
                this.tripRegistrationFormService.sendFormToSheetsIo(formData);

                const mailToFormData: FormToMailInformation<GymCoursesRegisterFormFields> = {
                    receiver: this.gymCoursesRegisterForm.controls['email'].getRawValue(),
                    formValues: this.gymCoursesRegisterForm.getRawValue(),
                };

                this.gymCoursesRegistrationFormService.sendConfirmationMail(mailToFormData);
            } else {
                console.error('No data provided');
            }
        }
    }
}
