/**
 * @copyright Copyright (c) 2022 Christian Silfang
 */

import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail';
import { BreakpointObserverService } from 'projects/shared-lib/src/lib/ui-common/services';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Trip } from '../../domain/models';
import { TRIPS_REGISTER_FORM_ELEMENTS } from './trips-register-form-fields';
import { TripRegisterFormFields, TripRegistrationFormServiceInterface } from './trips-registration-form.interfaces';

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
    ],
})
export class TripsRegistrationFormComponent implements OnInit, OnDestroy {
    private formBuilder = inject(FormBuilder);
    private tripRegistrationFormService = inject(TripRegistrationFormServiceInterface);
    breakpointObserver = inject(BreakpointObserverService);

    @Input() public additionalData$!: BehaviorSubject<Trip[]>;
    @Input() public additionalData!: Trip[];

    @Output() submitForm: EventEmitter<boolean> = new EventEmitter<boolean>();

    public isSending = false;
    public tripView!: string;
    public boardingList$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    public isTripChanged = true;
    public hasPreselectedData = false;
    public firstPartSelected = false;
    public currentSelectedTrip = null;
    public tripRegisterForm: FormGroup = new FormGroup({});
    public toDestroy$: Subject<void> = new Subject<void>();

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

    participants(): FormArray {
        return this.tripRegisterForm.get('participants') as FormArray;
    }

    newParticipant(): FormGroup {
        return this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            birthDate: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', Validators.email],
            boarding: ['', Validators.required],
            isCollapsed: [false],
        });
    }

    addParticipant() {
        this.participants().push(this.newParticipant());
    }

    removeParticipant(index: number) {
        this.participants().removeAt(index);
    }

    toggleCollapse(index: number) {
        const participant = this.participants().at(index);
        participant.get('isCollapsed')?.setValue(!participant.get('isCollapsed')?.value);
    }

    isParticipantCollapsed(index: number): boolean {
        return this.participants().at(index).get('isCollapsed')?.value;
    }

    private enableFormFields() {
        for (const field of TRIPS_REGISTER_FORM_ELEMENTS) {
            if (['firstName', 'lastName', 'email', 'phone', 'amount', 'boarding'].includes(field.id)) {
                continue;
            }
            this.tripRegisterForm.controls[field.id as string].enable();
        }
        this.tripRegisterForm.controls['additionalText'].enable();
    }

    private updateBoardingList(trip: Trip) {
        if (trip) {
            this.boardingList$.next(trip.boarding);
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
        if (this.tripRegisterForm.valid) {
            const formData: FormData = new FormData();
            // Add form group data to form data
            const timestamp = Date.now();
            formData.append('timestamp', new Date(timestamp).toLocaleString());

            const tripValue = this.tripRegisterForm.get('trip')?.value;
            formData.append('destination', tripValue.destination);
            formData.append('date', tripValue.date);
            formData.append('additionalText', this.tripRegisterForm.get('additionalText')?.value);

            const participants = this.tripRegisterForm.get('participants') as FormArray;
            participants.controls.forEach((participant, index) => {
                formData.append(`participant_${index}_firstName`, participant.get('firstName')?.value);
                formData.append(`participant_${index}_lastName`, participant.get('lastName')?.value);
                formData.append(`participant_${index}_birthDate`, participant.get('birthDate')?.value);
                formData.append(`participant_${index}_phone`, participant.get('phone')?.value);
                formData.append(`participant_${index}_email`, participant.get('email')?.value);
                formData.append(`participant_${index}_boarding`, participant.get('boarding')?.value);
            });

            if (formData) {
                this.submitForm.emit(true);
                this.tripRegistrationFormService.sendFormToSheetsIo(formData);
                this.isSending = false;

                const mailToFormData: FormToMailInformation<TripRegisterFormFields> = {
                    receiver: this.participants().controls[0].get('email')?.getRawValue(),
                    formValues: this.tripRegisterForm.getRawValue(),
                };

                this.tripRegistrationFormService.sendConfirmationMail(mailToFormData);
            } else {
                console.error('No data provided');
            }
        }
    }
}
