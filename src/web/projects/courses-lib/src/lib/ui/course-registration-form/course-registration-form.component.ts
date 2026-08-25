/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { AsyncPipe } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    inject,
    ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';
import { TurnstileWidgetComponent } from 'projects/shared-lib/src/lib/ui-common/components/turnstile-widget/turnstile-widget.component';
import { BreakpointObserverService } from 'projects/shared-lib/src/lib/ui-common/services';
import { COURSE_REGISTRATION_FORM_ELEMENTS } from './course-registration-form-fields';
import {
    CourseRegisterFormFields,
    CourseRegistrationFormServiceInterface,
} from './course-registration-form.interfaces';

@Component({
    selector: 'lib-course-registration-form',
    templateUrl: './course-registration-form.component.html',
    styleUrls: ['./course-registration-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatInput,
        MatError,
        MatButton,
        AsyncPipe,
        TurnstileWidgetComponent,
    ],
})
export class CourseRegistrationFormComponent implements OnInit, OnChanges {
    private formBuilder = inject(FormBuilder);
    private courseRegistrationFormService = inject(CourseRegistrationFormServiceInterface);
    breakpointObserver = inject(BreakpointObserverService);

    public turnstileSiteKey = this.courseRegistrationFormService.getTurnstileSiteKey();
    public turnstileToken: string | null = null;

    @Input() presetLevel?: string;
    @Input() presetCustomBccList?: string[];
    @Output() submitForm: EventEmitter<boolean> = new EventEmitter<boolean>();

    public courseRegisterForm: FormGroup = new FormGroup({});
    public sportTypeList = ['Ski Alpin', 'Snowboard'];
    public levelList = [
        'A1 – Anfänger Basis',
        'A2 – Anfänger Plus',
        'F1 – Fortgeschritten Basis',
        'F2 – Fortgeschritten Plus',
    ];

    ngOnInit(): void {
        this.courseRegisterForm = this.formBuilder.group({
            sportType: [null, [Validators.required]],
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            phone: [null, [Validators.required]],
            age: [null, [Validators.required]],
            additionalText: [null, []],
            level: [this.presetLevel ?? null, [Validators.required]],
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['presetLevel'] && !changes['presetLevel'].firstChange) {
            this.courseRegisterForm.get('level')?.setValue(this.presetLevel ?? null);
        }
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
        return !this.courseRegisterForm.valid || !this.turnstileToken;
    }

    public onTurnstileToken(token: string | null): void {
        this.turnstileToken = token;
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
                    formValues: { ...this.courseRegisterForm.getRawValue(), customBccList: this.presetCustomBccList },
                };

                this.courseRegistrationFormService.sendConfirmationMail(mailToFormData);
            } else {
                console.error('No data provided');
            }
        }
    }
}
