/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserverService } from 'projects/shared-lib/src/lib/ui-common/services';
import { COURSE_REGISTRATION_FORM_ELEMENTS } from './course-registration-form-fields';
import { CourseRegistrationFormServiceInterface } from './course-registration-form-service.interface';

@Component({
    selector: 'lib-course-registration-form',
    templateUrl: './course-registration-form.component.html',
    styleUrls: ['./course-registration-form.component.scss'],
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
            additionalText: [null, [Validators.required]],
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
            } else {
                console.error('No data provided');
            }
        }
    }
}
