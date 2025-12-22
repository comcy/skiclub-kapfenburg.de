/**
 * @copyright Copyright (c) 2022 Christian Silfang
 */

import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {
    calculateAge,
    formatDateByLocale,
    formatDateTime,
    GERMAN_DATE_FORMATS,
} from 'projects/shared-lib/src/lib/date-time';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail';
import { BreakpointObserverService } from 'projects/shared-lib/src/lib/ui-common/services';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Trip, TripParticipant } from '../../domain/models';
import {
    SheetDbRow,
    TripRegisterFormValue,
    TripRegistrationFormServiceInterface,
} from './trips-registration-form.interfaces';

@Component({
    selector: 'lib-trips-registration-form',
    templateUrl: './trips-registration-form.component.html',
    styleUrls: ['./trips-registration-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AsyncPipe,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
    ],
    providers: [
        provideNativeDateAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
    ],
})
export class TripsRegistrationFormComponent implements OnInit, OnDestroy {
    @Input() public additionalData$!: BehaviorSubject<Trip[]>;
    @Input() public additionalData!: Trip[];

    @Output() submitForm: EventEmitter<boolean> = new EventEmitter<boolean>();
    public breakpointObserver = inject(BreakpointObserverService);
    public isSending = false;
    public tripView!: string;
    public boardingList$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    public isTripChanged = true;
    public hasPreselectedData = false;
    public firstPartSelected = false;
    public tripRegisterForm: FormGroup = new FormGroup({});
    public toDestroy$: Subject<void> = new Subject<void>();

    private formBuilder = inject(FormBuilder);
    private tripRegistrationFormService = inject(TripRegistrationFormServiceInterface);

    ngOnInit(): void {
        this.tripRegisterForm = this.formBuilder.group({
            trip: [null, [Validators.required]],
            participants: this.formBuilder.array([]),
            additionalText: [{ value: '', disabled: true }],
        });

        this.addParticipant(); // Add one participant by default

        if (this.additionalData.length === 1) {
            this.hasPreselectedData = true;

            // When seleced via tile
            this.updateBoardingList(this.additionalData[0]);
            this.tripRegisterForm.patchValue({
                trip: this.additionalData[0],
            });
            this.enableFormFields();
        }

        this.tripRegisterForm.valueChanges.pipe(takeUntil(this.toDestroy$)).subscribe((formChanges) => {
            this.updateBoardingList(formChanges.trip);

            if (formChanges.trip && this.isTripChanged) {
                this.firstPartSelected = true;
                this.isTripChanged = !this.isTripChanged;

                this.updateBoardingList(formChanges.trip);
                this.enableFormFields();
            }
        });
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    private updateParticipantValidators(): void {
        this.participants().controls.forEach((participant, index) => {
            const emailControl = participant.get('email');
            const phoneControl = participant.get('phone');

            if (index === 0) {
                // First participant
                emailControl?.setValidators([Validators.required, Validators.email]);
                phoneControl?.setValidators(Validators.required);
            } else {
                // Additional participants
                emailControl?.clearValidators();
                emailControl?.setValidators(Validators.email);
                phoneControl?.clearValidators();
            }
            emailControl?.updateValueAndValidity();
            phoneControl?.updateValueAndValidity();
        });
    }

    participants(): FormArray {
        return this.tripRegisterForm.get('participants') as FormArray;
    }

    newParticipant(): FormGroup {
        return this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            birthday: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            boarding: ['', Validators.required],
            isCollapsed: [false],
        });
    }

    addParticipant() {
        this.participants().push(this.newParticipant());
        this.updateParticipantValidators();
    }

    removeParticipant(index: number) {
        this.participants().removeAt(index);
        this.updateParticipantValidators();
    }

    toggleCollapse(index: number) {
        const participant = this.participants().at(index);
        participant.get('isCollapsed')?.setValue(!participant.get('isCollapsed')?.value);
    }

    isParticipantCollapsed(index: number): boolean {
        return this.participants().at(index).get('isCollapsed')?.value;
    }

    private enableFormFields() {
        this.tripRegisterForm.get('additionalText')?.enable();
    }

    private updateBoardingList(trip: Trip) {
        if (trip) {
            this.boardingList$.next(trip.availableBoardings);
        }
    }

    public hasError(field: string): boolean {
        // TODO Generalize error messages
        // const foundField = this.tripRegisterFormElements.find((f) => {
        //   return field === f.id;
        // })?.validation;

        const emailError = this.tripRegisterForm.get(field)?.hasError('email') as boolean;

        const requiredError = this.tripRegisterForm.get(field)?.value;

        return emailError && requiredError;
    }

    public isSubmitDisabled(): boolean {
        if (this.tripRegisterForm.valid) {
            return false;
        }
        return true;
    }

    public submit(): void {
        this.isSending = true;

        if (!this.tripRegisterForm.valid) {
            this.isSending = false;
            return;
        }

        const rawValue = this.tripRegisterForm.getRawValue(); //as TripRegistrationFormValue;
        const timestamp = new Date().toISOString();

        const contactPerson = rawValue.participants[0];

        const rows: SheetDbRow[] = rawValue.participants.map((participant: TripParticipant) => {
            return {
                firstName: participant.firstName,
                lastName: participant.lastName,
                email: participant.email || contactPerson.email,
                phone: participant.phone || contactPerson.phone,
                additionalText: rawValue.additionalText || '',
                boarding: participant.boarding,
                destination: rawValue.trip.destination,
                date: rawValue.trip.date,
                birthday: `${formatDateByLocale(participant.birthday)} (${calculateAge(participant.birthday)})`,
                timestamp: formatDateTime(timestamp),
            };
        });

        this.submitForm.emit(true);

        this.tripRegistrationFormService.sendFormToSheetsIo(rows);

        const mailToFormData: FormToMailInformation<TripRegisterFormValue> = {
            receiver: contactPerson.email,
            formValues: rawValue,
        };

        this.tripRegistrationFormService.sendConfirmationMail(mailToFormData);

        this.isSending = false;
    }
}
