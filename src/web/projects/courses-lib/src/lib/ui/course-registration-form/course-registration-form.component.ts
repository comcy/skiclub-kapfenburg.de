/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';
import { BreakpointObserverService } from 'projects/shared-lib/src/lib/ui-common/services';
import { COURSE_REGISTRATION_FORM_ELEMENTS } from './course-registration-form-fields';
import {
    CourseRegisterFormFields,
    CourseRegistrationFormServiceInterface,
} from './course-registration-form.interfaces';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'lib-course-registration-form',
    templateUrl: './course-registration-form.component.html',
    styleUrls: ['./course-registration-form.component.scss'],
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatSelect,
        NgFor,
        MatOption,
        NgIf,
        MatInput,
        MatError,
        MatButton,
        AsyncPipe,
    ],
})
export class CourseRegistrationFormComponent implements OnInit {
    @Output() submitForm: EventEmitter<boolean> = new EventEmitter<boolean>();

    public courseRegisterForm: FormGroup = new FormGroup({});
    public sportTypeList = ['Ski Alpin', 'Snowboard'];
    public levelList = ['Anfänger', 'Könner', 'Fortgeschritten'];

    constructor(
        private formBuilder: FormBuilder,
        private courseRegistrationFormService: CourseRegistrationFormServiceInterface,
        public breakpointObserver: BreakpointObserverService,
    ) {}

    ngOnInit(): void {
        this.courseRegisterForm = this.formBuilder.group({
            sportType: [null, [Validators.required]],
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            phone: [null, [Validators.required]],
            age: [null, [Validators.required]],
            additionalText: [null, []],
            level: [null, [Validators.required]],
        });
    }

    public hasError(field: string): boolean {
        // TODO Generalize error messages
        // const foundField = this.tripRegisterFormElements.find((f) => {
        //   return field === f.id;
        // })?.validation;

        const emailError = this.courseRegisterForm.get(field)?.hasError('email') as boolean;
        const requiredError = this.courseRegisterForm.get(field)?.value;

        return emailError && requiredError;
    }

    public isSubmitDisabled(): boolean {
        if (this.courseRegisterForm.valid) {
            return false;
        }
        return true;
    }

    public submit(): void {
        if (this.courseRegisterForm.valid) {
            const formData: FormData = new FormData();
            // Add form group data to form data
            const timestamp = Date.now();
            formData.append('timestamp', new Date(timestamp).toLocaleString());
            for (const field of COURSE_REGISTRATION_FORM_ELEMENTS) {
                formData.append(field.id, this.courseRegisterForm.get(field.id)?.value);
            }

            if (formData) {
                this.submitForm.emit(true);
                this.courseRegistrationFormService.sendFormToSheetsIo(formData);

                const mailToFormData: FormToMailInformation<CourseRegisterFormFields> = {
                    receiver: this.courseRegisterForm.controls['email'].getRawValue(),
                    formValues: this.courseRegisterForm.getRawValue(),
                };

                this.courseRegistrationFormService.sendConfirmationMail(mailToFormData);
            } else {
                console.error('No data provided');
            }
        }
    }
}
