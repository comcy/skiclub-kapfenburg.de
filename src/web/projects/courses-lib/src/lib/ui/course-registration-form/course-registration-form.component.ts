/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { AsyncPipe, CurrencyPipe } from '@angular/common';
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
import { MatCheckbox } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getCourseConfirmationSuccessMessage } from 'projects/data/mail-templates';
import {
    calculateAge,
    GERMAN_DATE_FORMATS,
    GermanDateAdapter,
    formatDateByLocale,
} from 'projects/shared-lib/src/lib/date-time';
import { TurnstileWidgetComponent } from 'projects/shared-lib/src/lib/ui-common/components/turnstile-widget/turnstile-widget.component';
import { BreakpointObserverService } from 'projects/shared-lib/src/lib/ui-common/services';
import { SkiCoursePricing } from '../../domain/models/ski-course-pricing';
import { COURSE_REGISTRATION_FORM_ELEMENTS } from './course-registration-form-fields';
import { CourseRegistrationFormServiceInterface } from './course-registration-form.interfaces';

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
        MatCheckbox,
        MatDatepickerModule,
        AsyncPipe,
        CurrencyPipe,
        TurnstileWidgetComponent,
    ],
    providers: [
        { provide: DateAdapter, useClass: GermanDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: GERMAN_DATE_FORMATS },
    ],
})
export class CourseRegistrationFormComponent implements OnInit, OnChanges {
    private formBuilder = inject(FormBuilder);
    private courseRegistrationFormService = inject(CourseRegistrationFormServiceInterface);
    private snackBar = inject(MatSnackBar);
    private snackAction = 'Ok';
    breakpointObserver = inject(BreakpointObserverService);

    public turnstileSiteKey = this.courseRegistrationFormService.getTurnstileSiteKey();
    public turnstileToken: string | null = null;

    @Input() presetLevel?: string;
    @Input() presetCustomBccList?: string[];
    // The matching admin-managed course tile's real id (see
    // CoursesComponent.tileIdByLevelId) - undefined when no admin tile
    // matches the static level, in which case the public sck-api write
    // below is simply skipped (Sheets webhook + mail keep working as before).
    @Input() presetTileId?: string;
    // Global, once-per-season prices (see Einstellungen → Preismanagement) -
    // fetched once by CoursesComponent and passed down, same prop-drilling
    // pattern as presetCustomBccList. Null while still loading/unavailable.
    @Input() skiCoursePricing: SkiCoursePricing | null = null;
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
            birthday: [null, [Validators.required]],
            isMember: [false],
            additionalText: [null, []],
            level: [this.presetLevel ?? null, [Validators.required]],
        });
    }

    // sportType is free text ('Ski Alpin' | 'Snowboard', see sportTypeList)
    // - 'Ski Alpin' maps to the 'alpine' pricing group, everything else
    // ('Snowboard') to 'snowboard'.
    public getPrice(): number {
        const pricing = this.skiCoursePricing;
        const sportType = this.courseRegisterForm.get('sportType')?.value as string | null;
        const birthday = this.courseRegisterForm.get('birthday')?.value as Date | null;
        if (!pricing || !sportType || !birthday) return 0;

        const age = calculateAge(birthday);
        if (isNaN(age) || age < 0) return 0;

        const group = sportType === 'Ski Alpin' ? pricing.alpine : pricing.snowboard;
        const bracket = age < pricing.childUntilAge ? group.child : group.adult;
        const isMember = this.courseRegisterForm.get('isMember')?.value as boolean;
        return isMember ? bracket.member : bracket.nonMember;
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
            const rawValue = this.courseRegisterForm.getRawValue();
            const birthdayText = rawValue.birthday
                ? `${formatDateByLocale(rawValue.birthday)} (${calculateAge(rawValue.birthday)})`
                : '';
            const price = this.getPrice();

            const formData: FormData = new FormData();
            // Add form group data to form data
            const timestamp = Date.now();
            formData.append('timestamp', new Date(timestamp).toLocaleString());
            for (const field of COURSE_REGISTRATION_FORM_ELEMENTS) {
                const value = field.id === 'birthday' ? birthdayText : this.courseRegisterForm.get(field.id)?.value;
                formData.append(field.id, value);
            }
            formData.append('price', String(price));

            if (formData) {
                this.submitForm.emit(true);
                // presetTileId means a real admin-managed course tile - that
                // registration is the reliable record (server-side
                // confirmation mail, see the plan) and must drive the
                // user-facing message; Sheets stays silent so its own
                // outcome can never look like a failed registration when the
                // real one actually succeeded. No presetTileId only happens
                // when no admin course tiles exist at all (see #183), where
                // Sheets is still the only record.
                this.courseRegistrationFormService.sendFormToSheetsIo(formData, !!this.presetTileId);

                if (this.presetTileId) {
                    this.courseRegistrationFormService
                        .submitPublicRegistration(
                            this.presetTileId,
                            {
                                firstName: rawValue.firstName,
                                lastName: rawValue.lastName,
                                email: rawValue.email,
                                phone: rawValue.phone,
                                sportType: rawValue.sportType,
                                level: rawValue.level,
                                notes: [
                                    birthdayText ? `Geburtsdatum: ${birthdayText}` : '',
                                    rawValue.isMember ? 'Mitglied' : '',
                                    `Preis: ${price} €`,
                                    rawValue.additionalText,
                                ]
                                    .filter(Boolean)
                                    .join(' — '),
                            },
                            this.turnstileToken as string,
                        )
                        .subscribe({
                            next: () => this.snackBar.open(getCourseConfirmationSuccessMessage(), this.snackAction),
                            error: (error) => {
                                console.error('Fehler beim Speichern der Kurs-Anmeldung:', error);
                                this.snackBar.open(
                                    'Anmeldung fehlgeschlagen - bitte versuche es erneut oder kontaktiere uns per Mail.',
                                    this.snackAction,
                                );
                            },
                        });
                }
            } else {
                console.error('No data provided');
            }
        }
    }
}
