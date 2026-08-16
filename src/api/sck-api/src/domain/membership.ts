/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

export interface FamilyMember {
  firstName: string;
  lastName: string;
  birthday: string;
}

export interface MembershipRegistrationRequestBody {
  firstName: string;
  lastName: string;
  birthday: string;
  address: string;
  email: string;
  phone: string;
  isFamilyMembership: boolean;
  familyMembers?: FamilyMember[];
  iban: string;
  sepaMandateAccepted: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}
