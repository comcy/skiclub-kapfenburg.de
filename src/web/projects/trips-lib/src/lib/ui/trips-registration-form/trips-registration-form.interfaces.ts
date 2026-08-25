/**
 * @copyright Copyright (c) 2019 - 2024 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormElements } from 'projects/shared-lib/src/lib/components';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';
import { Observable } from 'rxjs';
import { TripParticipant } from '../../domain/models';
import { Trip } from '../../domain/models/trip-base';

export interface TripRegisterForm {
    tripRegisterForm: FormGroup;
    formFields: BaseFormElements[];
}

// Result of the parallel, capacity-aware sck-api submission (see
// submitPublicRegistration below) - undefined when the tile has no id, the
// request failed, or hasn't resolved yet: getTripConfirmationMailText()
// then just renders its normal, non-waitlist text (never blocks sending).
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
}

@Injectable()
export abstract class TripRegistrationFormServiceInterface {
    public abstract sendFormToSheetsIo(rows: SheetDbRow[]): void;
    public abstract sendConfirmationMail(mailData: FormToMailInformation<TripRegisterFormValue>): void;
    // Parallel, capacity-aware write into sck-api's trip_registrations (see
    // the plan) - does NOT replace sendFormToSheetsIo, which keeps running
    // unconditionally as before. turnstileToken is only verified here (the
    // Sheets webhook is external, not ours to protect server-side).
    public abstract submitPublicRegistration(
        tileId: string,
        participants: PublicRegistrationParticipantInput[],
        turnstileToken: string,
    ): Observable<WaitlistInfo>;
    // Public Turnstile site key (environment.turnstileSiteKey) - not a secret, only the
    // sck-api-side secret key needs protecting (see turnstile-middleware.ts).
    public abstract getTurnstileSiteKey(): string;
}
