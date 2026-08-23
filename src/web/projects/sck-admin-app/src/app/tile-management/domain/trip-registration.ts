export type RegistrationAgeCategory = 'adult' | 'youthUntil16' | 'childUntil6';
export type RegistrationStatus = 'confirmed' | 'waitlist' | 'cancelled';
export type RegistrationSource = 'manual' | 'phone' | 'paper' | 'sheet-import';

export interface TripRegistration {
    id: string;
    tileId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    memberId?: string;
    boardingId?: string;
    boardingName?: string;
    ageCategory: RegistrationAgeCategory;
    isMember: boolean;
    status: RegistrationStatus;
    source: RegistrationSource;
    notes?: string;
    orderIndex: number;
}

// memberId/isMember are always recomputed server-side from email - never
// sent by the client, see trip-registrations-service.ts on the API side.
export type TripRegistrationCreationParams = Omit<
    TripRegistration,
    'id' | 'tileId' | 'memberId' | 'isMember' | 'boardingName'
>;
