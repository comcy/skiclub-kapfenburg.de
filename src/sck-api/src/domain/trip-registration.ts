/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

export interface RegistrationRequestBody {
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
}

export interface TripRegisterFormValue {
    trip: Trip;
    additionalText: string;
    participants: TripParticipant[];
}

export type SheetDbRow = Omit<Trip, 'availableBoardings'> &
    TripParticipant & {
        id?: string;
        age?: number;
        additionalText: string;
        timestamp?: string;
    };
export interface Trip {
    destination: string;
    date: string;
    availableBoardings: string[];
}

export interface TripParticipant {
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
    phone: string;
    boarding: string;
}
