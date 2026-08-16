/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Injectable } from '@angular/core';
import { FormToMailInformation } from 'projects/shared-lib/src/lib/features/mail/models/mail.interfaces';

export interface FamilyMember {
    firstName: string;
    lastName: string;
    birthday: string;
}

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
    declarationAccepted: boolean;
    privacyAccepted: boolean;
}

export type MembershipRegistrationPayload = MembershipRegisterFormValue & {
    timestamp: string;
};

@Injectable()
export abstract class MembershipRegistrationFormServiceInterface {
    public abstract submitRegistration(payload: MembershipRegistrationPayload): void;
    public abstract sendConfirmationMail(mailData: FormToMailInformation<MembershipRegisterFormValue>): void;
    public abstract sendBoardNotificationMail(mailData: FormToMailInformation<MembershipRegisterFormValue>): void;
}
