/**
 * @copyright Copyright (c) 2019 - 2024 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from 'projects/shared-lib/src/lib/components';
import { Observable } from 'rxjs';
import { TripParticipant } from '../../domain/models';
import { Trip } from '../../domain/models/trip-base';

export interface TripRegisterForm {
    tripRegisterForm: FormGroup;
    formFields: BaseFormElements[];
}

// Result of the parallel, capacity-aware sck-api submission (see
// submitPublicRegistration below) - undefined when the tile has no id, the
// request failed, or hasn't resolved yet. The server-side confirmation mail
// (see trip-registration-mail-service.ts) then just renders its normal,
// non-waitlist text (this never blocks the registration itself).
export interface WaitlistInfo {
    status: 'confirmed' | 'waitlist';
    waitlistPosition?: number;
    waitlistCount?: number;
}

export interface TripRegisterFormValue {
    trip: Trip;
    additionalText: string;
    participants: TripParticipant[];
    waitlistInfo?: WaitlistInfo;
}

export type SheetDbRow = Omit<Trip, 'availableBoardings'> &
    TripParticipant & {
        age?: number;
        additionalText: string;
        timestamp?: string;
    };

export interface PublicRegistrationParticipantInput {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    birthday?: string;
    boarding?: string;
    // Own form choices - now persisted server-side (see the plan) so the
    // server-sent confirmation mail can render the price table without
    // duplicating pricing logic client-side.
    busOnly?: boolean;
    snowshoes?: boolean;
    courseRequested?: boolean;
    level?: string;
}

// One participant's price-relevant choices, sent to the live price preview
// endpoint (see TripRegistrationFormServiceInterface.getTripPricePreview) -
// mirrors sck-api's PricePreviewParticipant.
export interface TripPricePreviewParticipant {
    busOnly?: boolean;
    snowshoes?: boolean;
    courseRequested?: boolean;
    level?: string;
    birthday?: string;
    isMember?: boolean;
}

export interface TripPricePreviewResult {
    prices: number[];
    total: number;
}

@Injectable()
export abstract class TripRegistrationFormServiceInterface {
    // silent=true suppresses the built-in confirmation/error snackbar - used
    // for API-backed trips, where submitPublicRegistration below is the real,
    // reliable record and drives the user-facing message instead (a failed
    // Sheets mirror write must never look like a failed registration to the
    // user). Static-only trips (no sck-api id) have no such fallback, so
    // they keep relying on this call's own snackbar, same as before #182.
    public abstract sendFormToSheetsIo(rows: SheetDbRow[], silent?: boolean): void;
    // Parallel, capacity-aware write into sck-api's trip_registrations (see
    // the plan) - only called for API-backed trips (see
    // TripsRegistrationFormComponent.submit()'s isApiBackedTrip check).
    // turnstileToken is only verified here (the Sheets webhook is external,
    // not ours to protect server-side).
    public abstract submitPublicRegistration(
        tileId: string,
        participants: PublicRegistrationParticipantInput[],
        turnstileToken: string,
    ): Observable<WaitlistInfo>;
    // Public Turnstile site key (environment.turnstileSiteKey) - not a secret, only the
    // sck-api-side secret key needs protecting (see turnstile-middleware.ts).
    public abstract getTurnstileSiteKey(): string;
    // Live per-participant + total price, computed server-side (see
    // trip-pricing-service.ts) - replaces the form's former client-side
    // duplication of the pricing logic (see the plan).
    public abstract getTripPricePreview(
        tileId: string,
        participants: TripPricePreviewParticipant[],
    ): Observable<TripPricePreviewResult>;
}
