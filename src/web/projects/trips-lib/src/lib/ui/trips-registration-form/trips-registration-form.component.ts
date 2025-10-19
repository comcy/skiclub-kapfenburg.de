import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail';
import { BreakpointObserverService } from 'projects/shared-lib/src/lib/ui-common/services';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Trip } from '../../domain/models';
import { TRIPS_REGISTER_FORM_ELEMENTS } from './trips-register-form-fields';
import { TripRegisterFormFields, TripRegistrationFormServiceInterface } from './trips-registration-form.interfaces';
import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'lib-trips-registration-form',
    templateUrl: './trips-registration-form.component.html',
    styleUrls: ['./trips-registration-form.component.scss'],
    imports: [
        ReactiveFormsModule,
        NgIf,
        MatFormField,
        MatLabel,
        MatSelect,
        NgFor,
        MatOption,
        NgClass,
        MatInput,
        MatError,
        MatButton,
        MatProgressSpinner,
        AsyncPipe,
    ],
})
export class TripsRegistrationFormComponent implements OnInit, OnDestroy {
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

    constructor(
        private formBuilder: FormBuilder,
        private tripRegistrationFormService: TripRegistrationFormServiceInterface,
        public breakpointObserver: BreakpointObserverService,
    ) {}

    ngOnInit(): void {
        this.tripRegisterForm = this.formBuilder.group({
            trip: [null, [Validators.required]],
            firstName: [{ value: '', disabled: true }, Validators.required],
            lastName: [{ value: '', disabled: true }, Validators.required],
            email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
            phone: [{ value: '', disabled: true }, [Validators.required]],
            amount: [{ value: '', disabled: true }, [Validators.required]],
            additionalText: [{ value: '', disabled: true }],
            boarding: [{ value: '', disabled: true }, [Validators.required]],
        });

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

    private enableFormFields() {
        for (const field of TRIPS_REGISTER_FORM_ELEMENTS) {
            this.tripRegisterForm.controls[field.id as string].enable();
        }
    }

    private updateBoardingList(trip: Trip) {
        this.boardingList$.next(trip.boarding);
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
            for (const field of TRIPS_REGISTER_FORM_ELEMENTS) {
                if (field.id === 'trip') {
                    const tripValue = this.tripRegisterForm.get(field.id)?.value;
                    formData.append('destination', tripValue.destination);
                    formData.append('date', tripValue.date);
                }
                formData.append(field.id, this.tripRegisterForm.get(field.id)?.value);
            }

            if (formData) {
                this.submitForm.emit(true);
                this.tripRegistrationFormService.sendFormToSheetsIo(formData);
                this.isSending = false;

                const mailToFormData: FormToMailInformation<TripRegisterFormFields> = {
                    receiver: this.tripRegisterForm.controls['email'].getRawValue(),
                    formValues: this.tripRegisterForm.getRawValue(),
                };

                this.tripRegistrationFormService.sendConfirmationMail(mailToFormData);
            } else {
                console.error('No data provided');
            }
        }
    }
}
