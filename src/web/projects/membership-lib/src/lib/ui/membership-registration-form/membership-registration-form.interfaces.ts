/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FamilyMember {
    firstName: string;
    lastName: string;
    birthday: string;
}

// Mirrors MembershipRegistrationRequestBody in sck-api's domain/membership.ts.
// termsAccepted is named to match the API contract (it covers the "Beitrittserklärung" checkbox).
export interface MembershipRegisterFormValue {
    firstName: string;
    lastName: string;
    birthday: string;
    address: string;
    email: string;
    phone: string;
    isFamilyMembership: boolean;
    familyMembers: FamilyMember[];
    iban: string;
    sepaMandateAccepted: boolean;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    turnstileToken: string;
}

// sck-api persists the registration (SEPA/IBAN field-encrypted, separate from the rest) and sends
// both the applicant confirmation and board notification mails itself - the frontend only submits.
@Injectable()
export abstract class MembershipRegistrationFormServiceInterface {
    public abstract submitRegistration(formValue: MembershipRegisterFormValue): void;
    // Public Turnstile site key (environment.turnstileSiteKey) - not a secret, only the
    // sck-api-side secret key needs protecting (see turnstile-middleware.ts).
    public abstract getTurnstileSiteKey(): string;
    // Double-Opt-in: POST {sckApiUrl}/membership/confirm - see membership-confirmation-service.ts.
    public abstract confirmRegistration(token: string): Observable<void>;
}
