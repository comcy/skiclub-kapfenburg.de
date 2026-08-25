/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Trip } from '../../domain/models/trip-base';
import { TripsRegistrationFormComponent } from './trips-registration-form.component';
import { TripRegistrationFormServiceInterface, WaitlistInfo } from './trips-registration-form.interfaces';

const TRIP_WITH_ID: Trip = {
    id: 'tile-1',
    destination: 'Alps',
    date: '1.1.2026',
    availableBoardings: ['Kapfenburg (7:00 Uhr)'],
};

const TRIP_WITHOUT_ID: Trip = {
    destination: 'Alps',
    date: '1.1.2026',
    availableBoardings: ['Kapfenburg (7:00 Uhr)'],
};

describe('TripsRegistrationFormComponent', () => {
    let component: TripsRegistrationFormComponent;
    let fixture: ComponentFixture<TripsRegistrationFormComponent>;
    let serviceSpy: jasmine.SpyObj<TripRegistrationFormServiceInterface>;

    const createComponent = (trip: Trip) => {
        fixture = TestBed.createComponent(TripsRegistrationFormComponent);
        component = fixture.componentInstance;
        component.additionalData = [trip];
        fixture.detectChanges();

        // Fill the one auto-added, now-enabled participant with valid data.
        component.participants().at(0).patchValue({
            firstName: 'Max',
            lastName: 'Mustermann',
            birthday: '2000-01-01',
            phone: '0123456',
            email: 'max@example.com',
            boarding: 'Kapfenburg (7:00 Uhr)',
        });
        component.tripRegisterForm.get('agbAccepted')?.setValue(true);
        component.turnstileToken = 'test-turnstile-token';
    };

    beforeEach(async () => {
        serviceSpy = jasmine.createSpyObj<TripRegistrationFormServiceInterface>(
            'TripRegistrationFormServiceInterface',
            ['sendFormToSheetsIo', 'sendConfirmationMail', 'submitPublicRegistration', 'getTurnstileSiteKey'],
        );
        serviceSpy.submitPublicRegistration.and.returnValue(of({ status: 'confirmed' } as WaitlistInfo));

        await TestBed.configureTestingModule({
            imports: [TripsRegistrationFormComponent],
            providers: [provideRouter([]), { provide: TripRegistrationFormServiceInterface, useValue: serviceSpy }],
        }).compileComponents();
    });

    it('should create', () => {
        createComponent(TRIP_WITHOUT_ID);
        expect(component).toBeTruthy();
    });

    describe('submit() - Kapazitäts-Warnung + Warteliste (Runde 3)', () => {
        it('does not call submitPublicRegistration when the trip has no id (static fallback trip)', () => {
            createComponent(TRIP_WITHOUT_ID);

            component.submit();

            expect(serviceSpy.submitPublicRegistration).not.toHaveBeenCalled();
            expect(serviceSpy.sendConfirmationMail).toHaveBeenCalledTimes(1);
            const mailData = serviceSpy.sendConfirmationMail.calls.mostRecent().args[0];
            expect(mailData.formValues.waitlistInfo).toBeUndefined();
        });

        it('calls submitPublicRegistration with the tile id and forwards its result as waitlistInfo', () => {
            const waitlistInfo: WaitlistInfo = { status: 'waitlist', waitlistPosition: 2, waitlistCount: 1 };
            serviceSpy.submitPublicRegistration.and.returnValue(of(waitlistInfo));
            createComponent(TRIP_WITH_ID);

            component.submit();

            expect(serviceSpy.submitPublicRegistration).toHaveBeenCalledWith(
                'tile-1',
                jasmine.arrayContaining([jasmine.objectContaining({ firstName: 'Max' })]),
                'test-turnstile-token',
            );
            const mailData = serviceSpy.sendConfirmationMail.calls.mostRecent().args[0];
            expect(mailData.formValues.waitlistInfo).toEqual(waitlistInfo);
        });

        it('still sends the confirmation mail (without waitlistInfo) when the capacity check fails - fail-open', () => {
            serviceSpy.submitPublicRegistration.and.returnValue(throwError(() => new Error('network error')));
            createComponent(TRIP_WITH_ID);

            component.submit();

            expect(serviceSpy.sendConfirmationMail).toHaveBeenCalledTimes(1);
            const mailData = serviceSpy.sendConfirmationMail.calls.mostRecent().args[0];
            expect(mailData.formValues.waitlistInfo).toBeUndefined();
        });

        it('never calls submitPublicRegistration or sendConfirmationMail when the form is invalid', () => {
            createComponent(TRIP_WITH_ID);
            component.participants().at(0).patchValue({ firstName: '' });

            component.submit();

            expect(serviceSpy.submitPublicRegistration).not.toHaveBeenCalled();
            expect(serviceSpy.sendConfirmationMail).not.toHaveBeenCalled();
        });

        it('always forwards the registration to the Google Sheet regardless of tile id', () => {
            createComponent(TRIP_WITH_ID);

            component.submit();

            expect(serviceSpy.sendFormToSheetsIo).toHaveBeenCalledTimes(1);
        });
    });
});
