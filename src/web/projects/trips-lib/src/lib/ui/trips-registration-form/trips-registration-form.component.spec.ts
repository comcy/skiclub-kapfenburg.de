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
    confirmedRegistrationsCount: 0,
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
            ['sendFormToSheetsIo', 'submitPublicRegistration', 'getTurnstileSiteKey', 'getTripPricePreview'],
        );
        serviceSpy.submitPublicRegistration.and.returnValue(of({ status: 'confirmed' } as WaitlistInfo));
        serviceSpy.getTripPricePreview.and.returnValue(of({ prices: [], total: 0 }));

        await TestBed.configureTestingModule({
            imports: [TripsRegistrationFormComponent],
            providers: [provideRouter([]), { provide: TripRegistrationFormServiceInterface, useValue: serviceSpy }],
        }).compileComponents();
    });

    it('should create', () => {
        createComponent(TRIP_WITHOUT_ID);
        expect(component).toBeTruthy();
    });

    describe('submit() - sck-api registration (mail is now sent server-side, see the plan)', () => {
        it('does not call submitPublicRegistration when the trip has no id (static fallback trip)', () => {
            createComponent(TRIP_WITHOUT_ID);

            component.submit();

            expect(serviceSpy.submitPublicRegistration).not.toHaveBeenCalled();
        });

        it('calls submitPublicRegistration with the tile id and the participant option fields', () => {
            const waitlistInfo: WaitlistInfo = { status: 'waitlist', waitlistPosition: 2, waitlistCount: 1 };
            serviceSpy.submitPublicRegistration.and.returnValue(of(waitlistInfo));
            createComponent(TRIP_WITH_ID);

            component.submit();

            expect(serviceSpy.submitPublicRegistration).toHaveBeenCalledWith(
                'tile-1',
                jasmine.arrayContaining([
                    jasmine.objectContaining({
                        firstName: 'Max',
                        busOnly: false,
                        snowshoes: false,
                        courseRequested: false,
                        isMember: false,
                    }),
                ]),
                'test-turnstile-token',
            );
        });

        it('does not throw when the capacity check fails - fail-open', () => {
            serviceSpy.submitPublicRegistration.and.returnValue(throwError(() => new Error('network error')));
            createComponent(TRIP_WITH_ID);

            expect(() => component.submit()).not.toThrow();
        });

        it('never calls submitPublicRegistration when the form is invalid', () => {
            createComponent(TRIP_WITH_ID);
            component.participants().at(0).patchValue({ firstName: '' });

            component.submit();

            expect(serviceSpy.submitPublicRegistration).not.toHaveBeenCalled();
        });

        it('always forwards the registration to the Google Sheet regardless of tile id', () => {
            createComponent(TRIP_WITH_ID);

            component.submit();

            expect(serviceSpy.sendFormToSheetsIo).toHaveBeenCalledTimes(1);
        });
    });
});
