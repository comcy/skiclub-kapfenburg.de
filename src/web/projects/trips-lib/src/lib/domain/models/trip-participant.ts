/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

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
}
