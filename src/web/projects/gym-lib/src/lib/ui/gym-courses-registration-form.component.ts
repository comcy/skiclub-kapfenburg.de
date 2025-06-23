import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreakpointObserverService } from '@shared/ui-common';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';
import { GYM_COURSES_REGISTRATION_FORM_ELEMENTS } from './gym-courses-registration-form-fields';
import {
    GymCoursesRegisterFormFields,
    GymCoursesRegistrationFormServiceInterface,
} from './gym-courses-registration-form.interfaces';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GymCourse } from '../domain';

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
    ],
    templateUrl: './gym-courses-registration-form.component.html',
    styleUrl: './gym-courses-registration-form.component.scss',
    standalone: true,
})
export class GymCoursesRegistrationFormComponent implements OnInit {
    @Input() public additionalData!: GymCourse[];

    @Output() submitForm: EventEmitter<boolean> = new EventEmitter<boolean>();

    public gymCoursesRegisterForm: FormGroup = new FormGroup({});
    public courseList = ['Pilates'];

    private formBuilder = inject(FormBuilder);
    private gymCoursesRegistrationFormService = inject(GymCoursesRegistrationFormServiceInterface);
    public breakpointObserver = inject(BreakpointObserverService);

    ngOnInit(): void {
        this.gymCoursesRegisterForm = this.formBuilder.group({
            courseType: [null, [Validators.required]],
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            phone: [null, [Validators.required]],
            age: [null, [Validators.required]],
            additionalText: [null, []],
        });
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
