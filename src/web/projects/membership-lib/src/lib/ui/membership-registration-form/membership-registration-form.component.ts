/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { GERMAN_DATE_FORMATS } from 'projects/shared-lib/src/lib/date-time';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail';
import { BreakpointObserverService } from 'projects/shared-lib/src/lib/ui-common/services';
import { Subject, takeUntil } from 'rxjs';
import {
    MembershipRegisterFormValue,
    MembershipRegistrationFormServiceInterface,
    MembershipRegistrationPayload,
} from './membership-registration-form.interfaces';

// Loose IBAN shape check (country code + check digits + BBAN), spaces allowed for readability.
// Real checksum validation happens server-side where the value is persisted.
const IBAN_PATTERN = /^[A-Z]{2}[0-9]{2}[A-Z0-9 ]{10,34}$/;

@Component({
    selector: 'lib-membership-registration-form',
    templateUrl: './membership-registration-form.component.html',
    styleUrls: ['./membership-registration-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AsyncPipe,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatTooltipModule,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [
        provideNativeDateAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
    ],
})
export class MembershipRegistrationFormComponent implements OnInit, OnDestroy {
    @Output() submitForm: EventEmitter<boolean> = new EventEmitter<boolean>();

    public breakpointObserver = inject(BreakpointObserverService);
    public isSending = false;
    public membershipRegisterForm: FormGroup = new FormGroup({});
    public toDestroy$: Subject<void> = new Subject<void>();

    private formBuilder = inject(FormBuilder);
    private membershipRegistrationFormService = inject(MembershipRegistrationFormServiceInterface);
    private router = inject(Router);

    ngOnInit(): void {
        this.membershipRegisterForm = this.formBuilder.group({
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            birthday: [null, Validators.required],
            address: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            phone: [null, Validators.required],
            isFamilyMembership: [false],
            familyMembers: this.formBuilder.array([]),
            iban: [null, [Validators.required, Validators.pattern(IBAN_PATTERN)]],
            sepaMandateAccepted: [false, Validators.requiredTrue],
            declarationAccepted: [false, Validators.requiredTrue],
            privacyAccepted: [false, Validators.requiredTrue],
        });

        this.membershipRegisterForm
            .get('isFamilyMembership')
            ?.valueChanges.pipe(takeUntil(this.toDestroy$))
            .subscribe((checked) => {
                if (!checked) {
                    this.familyMembers().clear();
                }
            });
    }

    ngOnDestroy(): void {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    familyMembers(): FormArray {
        return this.membershipRegisterForm.get('familyMembers') as FormArray;
    }

    newFamilyMember(): FormGroup {
        return this.formBuilder.group({
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            birthday: [null, Validators.required],
        });
    }

    addFamilyMember(): void {
        this.familyMembers().push(this.newFamilyMember());
    }

    removeFamilyMember(index: number): void {
        this.familyMembers().removeAt(index);
    }

    public hasError(field: string): boolean {
        const emailError = this.membershipRegisterForm.get(field)?.hasError('email') as boolean;
        const requiredError = this.membershipRegisterForm.get(field)?.value;

        return emailError && requiredError;
    }

    public isSubmitDisabled(): boolean {
        return !this.membershipRegisterForm.valid;
    }

    public openDeclarationDialog(): void {
        this.router.navigate([{ outlets: { modal: ['satzung'] } }]);
    }

    public submit(): void {
        this.isSending = true;

        if (!this.membershipRegisterForm.valid) {
            this.isSending = false;
            return;
        }

        const formValues = this.membershipRegisterForm.getRawValue() as MembershipRegisterFormValue;
        const payload: MembershipRegistrationPayload = {
            ...formValues,
            timestamp: new Date().toISOString(),
        };

        this.membershipRegistrationFormService.submitRegistration(payload);

        const mailToFormData: FormToMailInformation<MembershipRegisterFormValue> = {
            receiver: formValues.email,
            formValues,
        };

        this.membershipRegistrationFormService.sendConfirmationMail(mailToFormData);
        this.membershipRegistrationFormService.sendBoardNotificationMail(mailToFormData);

        this.submitForm.emit(true);
        this.isSending = false;
    }
}
