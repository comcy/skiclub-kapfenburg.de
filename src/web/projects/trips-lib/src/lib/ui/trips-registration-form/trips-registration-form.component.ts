/**
 * @copyright Copyright (c) 2022 Christian Silfang
 */

import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ChangeDetectionStrategy,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import {
    calculateAge,
    formatDateByLocale,
    formatDateTime,
    GERMAN_DATE_FORMATS,
    GermanDateAdapter,
} from 'projects/shared-lib/src/lib/date-time';
import { getTripConfirmationSuccessMessage } from 'projects/data/mail-templates';
import { TurnstileWidgetComponent } from 'projects/shared-lib/src/lib/ui-common/components/turnstile-widget/turnstile-widget.component';
import { BreakpointObserverService } from 'projects/shared-lib/src/lib/ui-common/services';
import { BehaviorSubject, debounceTime, Subject, takeUntil } from 'rxjs';
import { TripParticipant } from '../../domain/models';
import { Trip } from '../../domain/models/trip-base';
import { TripConfig } from '../../domain/models/trip-config';
import { TripPricingDialogComponent } from '../trip-pricing-dialog/trip-pricing-dialog.component';
import {
    PublicRegistrationParticipantInput,
    SheetDbRow,
    TripPricePreviewParticipant,
    TripPricePreviewResult,
    TripRegistrationFormServiceInterface,
} from './trips-registration-form.interfaces';

interface CourseOption {
    label: string;
    value: string;
}

@Component({
    selector: 'lib-trips-registration-form',
    templateUrl: './trips-registration-form.component.html',
    styleUrls: ['./trips-registration-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AsyncPipe,
        CurrencyPipe,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatDialogModule,
        TurnstileWidgetComponent,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [
        { provide: DateAdapter, useClass: GermanDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
    ],
})
export class TripsRegistrationFormComponent implements OnInit, OnDestroy {
    @Input() public additionalData$!: BehaviorSubject<Trip[]>;
    @Input() public additionalData!: Trip[];

    @Output() submitForm: EventEmitter<boolean> = new EventEmitter<boolean>();
    public breakpointObserver = inject(BreakpointObserverService);
    private snackBar = inject(MatSnackBar);
    private snackAction = 'Ok';
    public isSending = false;
    public tripView!: string;
    public boardingList$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    public isTripChanged = true;
    public hasPreselectedData = false;
    public firstPartSelected = false;
    public tripRegisterForm: FormGroup = new FormGroup({});
    public toDestroy$: Subject<void> = new Subject<void>();
    public turnstileToken: string | null = null;

    public sportTypeList = ['Ski Alpin', 'Snowboard'];

    public tripConfig: TripConfig | undefined;
    public availableLevelOptions: CourseOption[] = [];
    // Zeros until the first debounced /trip-price-preview response arrives
    // (see refreshPricePreview) - the template reads from this instead of
    // computing locally.
    public pricePreview: TripPricePreviewResult = { prices: [], total: 0 };

    private formBuilder = inject(FormBuilder);
    private tripRegistrationFormService = inject(TripRegistrationFormServiceInterface);
    private dialog = inject(MatDialog);
    private router = inject(Router);

    public turnstileSiteKey = this.tripRegistrationFormService.getTurnstileSiteKey();

    ngOnInit(): void {
        this.tripRegisterForm = this.formBuilder.group({
            trip: [null, [Validators.required]],
            participants: this.formBuilder.array([]),
            additionalText: [{ value: '', disabled: true }],
            agbAccepted: [false, Validators.requiredTrue],
        });

        this.addParticipant(); // Add one participant by default

        if (this.additionalData.length === 1) {
            this.hasPreselectedData = true;

            // When seleced via tile
            this.updateBoardingList(this.additionalData[0]);
            this.tripConfig = this.additionalData[0].tripConfig;
            this.updateLevelOptions();
            this.tripRegisterForm.patchValue({
                trip: this.additionalData[0],
            });
            this.enableFormFields();
        }

        this.tripRegisterForm.valueChanges.pipe(takeUntil(this.toDestroy$)).subscribe((formChanges) => {
            if (formChanges.trip) {
                this.updateBoardingList(formChanges.trip);
                this.tripConfig = formChanges.trip.tripConfig;
                this.updateLevelOptions();
            }

            if (formChanges.trip && this.isTripChanged) {
                this.firstPartSelected = true;
                this.isTripChanged = !this.isTripChanged;

                this.updateBoardingList(formChanges.trip);
                this.enableFormFields();
            }
        });

        // Debounced separately from the subscription above - form fields
        // (esp. birthday/checkboxes) change frequently while a participant
        // is being filled in, and each change would otherwise fire its own
        // request to the price-preview endpoint.
        this.tripRegisterForm.valueChanges
            .pipe(debounceTime(300), takeUntil(this.toDestroy$))
            .subscribe(() => this.refreshPricePreview());
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    private updateLevelOptions(): void {
        this.availableLevelOptions = [];

        const addons = this.tripConfig?.pricing?.addons;
        if (!addons) return;

        if (addons.courseBeginner) {
            this.availableLevelOptions.push({ label: 'Anfängerkurs', value: 'Anfängerkurs' });
        }
        if (addons.courseAdvanced) {
            this.availableLevelOptions.push({ label: 'Fortgeschrittenenkurs', value: 'Fortgeschrittenenkurs' });
        }
        if (addons.technikHalf) {
            this.availableLevelOptions.push({ label: 'Techniktraining (1/2 Tag)', value: 'Techniktraining (1/2 Tag)' });
        }
        if (addons.technikFull) {
            this.availableLevelOptions.push({
                label: 'Techniktraining (ganzer Tag)',
                value: 'Techniktraining (ganzer Tag)',
            });
        }
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
        const isDisabled = !(this.firstPartSelected || this.hasPreselectedData);
        const group = this.formBuilder.group({
            firstName: [{ value: '', disabled: isDisabled }, Validators.required],
            lastName: [{ value: '', disabled: isDisabled }, Validators.required],
            birthday: [{ value: '', disabled: isDisabled }, Validators.required],
            phone: [{ value: '', disabled: isDisabled }, Validators.required],
            email: [{ value: '', disabled: isDisabled }, [Validators.required, Validators.email]],
            boarding: [{ value: '', disabled: isDisabled }, Validators.required],
            isCollapsed: [false],
            isMember: [{ value: false, disabled: isDisabled }],
            busOnly: [{ value: false, disabled: isDisabled }],
            courseRequested: [{ value: false, disabled: isDisabled }],
            snowshoes: [{ value: false, disabled: isDisabled }],
            sportType: [{ value: '', disabled: isDisabled }],
            level: [{ value: '', disabled: isDisabled }],
        });

        group
            .get('busOnly')
            ?.valueChanges.pipe(takeUntil(this.toDestroy$))
            .subscribe((checked) => {
                if (!checked) {
                    group.get('snowshoes')?.setValue(false);
                }
            });

        group
            .get('courseRequested')
            ?.valueChanges.pipe(takeUntil(this.toDestroy$))
            .subscribe((checked) => {
                const sportControl = group.get('sportType');
                const levelControl = group.get('level');
                if (checked) {
                    sportControl?.setValidators(Validators.required);
                    levelControl?.setValidators(Validators.required);
                } else {
                    sportControl?.clearValidators();
                    levelControl?.clearValidators();
                    sportControl?.setValue('');
                    levelControl?.setValue('');
                }
                sportControl?.updateValueAndValidity();
                levelControl?.updateValueAndValidity();
            });

        return group;
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
        this.participants().enable();
    }

    private updateBoardingList(trip: Trip) {
        if (trip) {
            this.boardingList$.next(trip.availableBoardings);
        }
    }

    public getCourseCheckboxLabel(): string {
        const addons = this.tripConfig?.pricing?.addons;
        if (!addons) return '';

        const hasCourses = !!(addons.courseBeginner || addons.courseAdvanced);
        const hasTechnik = !!(addons.technikHalf || addons.technikFull);

        if (hasCourses && hasTechnik) {
            return 'Kurs oder Techniktraining gewünscht';
        } else if (hasCourses) {
            return 'Kurs gewünscht';
        } else if (hasTechnik) {
            return 'Techniktraining gewünscht';
        }
        return '';
    }

    // Both read from the latest /trip-price-preview response (see
    // refreshPricePreview) instead of computing locally - the pricing logic
    // now lives exactly once, server-side (see the plan).
    public getParticipantPrice(index: number): number {
        return this.pricePreview.prices[index] ?? 0;
    }

    public getTotalPrice(): number {
        return this.pricePreview.total;
    }

    private refreshPricePreview(): void {
        const selectedTrip = this.tripRegisterForm.get('trip')?.value as Trip;
        const tileId = selectedTrip?.id;
        if (!tileId || this.participants().length === 0) {
            this.pricePreview = { prices: [], total: 0 };
            return;
        }

        const participants: TripPricePreviewParticipant[] = this.participants().controls.map((group) => {
            const value = group.getRawValue();
            return {
                busOnly: value.busOnly,
                snowshoes: value.snowshoes,
                courseRequested: value.courseRequested,
                level: value.level || undefined,
                birthday: value.birthday,
                isMember: value.isMember,
            };
        });

        this.tripRegistrationFormService.getTripPricePreview(tileId, participants).subscribe({
            next: (result) => (this.pricePreview = result),
            error: (error) => console.error('Fehler bei der Preisvorschau:', error),
        });
    }

    public getParticipantOptionsSummary(index: number): string[] {
        if (!this.tripConfig) return [];

        const participant = this.participants().at(index).getRawValue();
        const options: string[] = [];

        // Base
        if (participant.busOnly) {
            options.push('Nur Busfahrt');
        } else {
            const age = calculateAge(participant.birthday);
            if (age < 6) options.push('Bus + Lift (Kind)');
            else if (age < 16) options.push('Bus + Lift (Jugend)');
            else options.push('Bus + Lift (Erwachsen)');
        }

        // Member
        if (participant.isMember) options.push('Mitglied');

        // Addons
        if (participant.snowshoes) options.push('Schneeschuhe');
        if (participant.courseRequested && participant.level) {
            options.push(participant.level);
            if (participant.sportType) options.push(participant.sportType);
        }

        return options;
    }

    public hasError(field: string): boolean {
        const emailError = this.tripRegisterForm.get(field)?.hasError('email') as boolean;
        const requiredError = this.tripRegisterForm.get(field)?.value;

        return emailError && requiredError;
    }

    public isSubmitDisabled(): boolean {
        return !this.tripRegisterForm.valid || !this.turnstileToken;
    }

    public onTurnstileToken(token: string | null): void {
        this.turnstileToken = token;
    }

    public openPricingDialog() {
        if (!this.tripConfig) return;

        const selectedTrip = this.tripRegisterForm.get('trip')?.value as Trip;

        this.dialog.open(TripPricingDialogComponent, {
            data: {
                tripConfig: this.tripConfig,
                title: selectedTrip?.destination || '',
            },
            width: '90vw',
            maxWidth: '600px',
        });
    }

    public openAgbDialog() {
        this.router.navigate([{ outlets: { modal: ['agb'] } }]);
    }

    public submit(): void {
        this.isSending = true;

        if (!this.tripRegisterForm.valid) {
            this.isSending = false;
            return;
        }

        const rawValue = this.tripRegisterForm.getRawValue();
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
                isMember: participant.isMember,
                busOnly: participant.busOnly,
                snowshoes: participant.snowshoes,
                courseRequested: participant.courseRequested,
                sportType: participant.sportType,
                level: participant.level,
            };
        });

        // Only a real sck-api tile can take the capacity-aware registration
        // below (static trips' id would just 404 there) - see
        // confirmedRegistrationsCount's own doc comment. For those, that
        // call is the real, reliable record (server-side confirmation mail
        // included, see the plan) and must drive the user-facing message;
        // the Sheets mirror below stays silent so its own outcome - broken
        // here today by a misconfigured TRIP_SHEET_URL - can never look like
        // a failed registration when the real one actually succeeded.
        // Static trips have no sck-api counterpart at all, so they keep
        // relying on Sheets' own message, exactly as before #182.
        const tileId: string | undefined = rawValue.trip?.id;
        const isApiBackedTrip = rawValue.trip?.confirmedRegistrationsCount !== undefined;

        this.handleSheetRegistration(rows, isApiBackedTrip);

        if (isApiBackedTrip && tileId) {
            const publicParticipants: PublicRegistrationParticipantInput[] = rawValue.participants.map(
                (participant: TripParticipant) => ({
                    firstName: participant.firstName,
                    lastName: participant.lastName,
                    email: participant.email || contactPerson.email,
                    phone: participant.phone || contactPerson.phone,
                    birthday: participant.birthday,
                    boarding: participant.boarding,
                    busOnly: participant.busOnly,
                    snowshoes: participant.snowshoes,
                    courseRequested: participant.courseRequested,
                    level: participant.level,
                    isMember: participant.isMember,
                }),
            );

            this.tripRegistrationFormService
                .submitPublicRegistration(tileId, publicParticipants, this.turnstileToken as string)
                .subscribe({
                    next: () => this.snackBar.open(getTripConfirmationSuccessMessage(), this.snackAction),
                    error: (error) => {
                        console.error('Anmeldung fehlgeschlagen:', error);
                        this.snackBar.open(
                            'Anmeldung fehlgeschlagen - bitte versuche es erneut oder kontaktiere uns per Mail.',
                            this.snackAction,
                        );
                    },
                });
        }

        this.submitForm.emit(true);
        this.isSending = false;
    }

    private handleSheetRegistration(rows: SheetDbRow[], silent = false): void {
        this.tripRegistrationFormService.sendFormToSheetsIo(rows, silent);
    }
}
