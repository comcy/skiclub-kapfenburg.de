/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { TripConfig } from './trip-config';

export interface Trip {
    // Set by every call site regardless of origin - the remaining static
    // TRIP_DATA info-tiles (Skiboerse, Schneeschuhverleih) have their own
    // hardcoded id too, so this alone does NOT mean "this is an sck-api
    // event tile" (see confirmedRegistrationsCount below for that).
    id?: string;
    // Only ever set (even to 0) for a real sck-api tile - the backend always
    // computes this for type='event'. Ausfahrten-Events sind seit Issue
    // #215 ausschliesslich API-Tiles, nur die zwei statischen Info-Tiles
    // lassen das Feld weiterhin unset (siehe home.component.ts's isTripFull
    // fuer denselben Discriminant). This is what
    // TripsRegistrationFormComponent.submit() actually gates the
    // capacity-aware sck-api registration on - sending a static tile's id
    // there would just 404.
    confirmedRegistrationsCount?: number;
    destination: string;
    date: string;
    availableBoardings: string[];
    tripConfig?: TripConfig;
}

// Price structure
export interface PriceByMembership {
    member: number;
    nonMember: number;
}

// Membership
export type MembershipType = 'member' | 'nonMember';

// Categories by age
export type AgeCategory = 'adult' | 'youthUntil16' | 'childUntil6';
