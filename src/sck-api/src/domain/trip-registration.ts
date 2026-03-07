/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

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
    isMember?: boolean;
    busOnly?: boolean;
    courseRequested?: boolean;
    snowshoes?: boolean;
    sportType?: string;
    level?: string;
    price?: number;
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
        eventId?: string;
    };
