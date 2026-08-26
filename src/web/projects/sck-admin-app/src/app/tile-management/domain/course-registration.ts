export type CourseRegistrationStatus = 'confirmed' | 'cancelled';
export type CourseRegistrationSource = 'manual' | 'sheet-import';

export interface CourseRegistration {
    id: string;
    tileId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    memberId?: string;
    birthday?: string;
    sportType?: string;
    level?: string;
    groupId?: string;
    isMember: boolean;
    status: CourseRegistrationStatus;
    source: CourseRegistrationSource;
    notes?: string;
    orderIndex: number;
    // Admin email who created the row, set server-side - undefined for
    // public self-registrations (no admin author).
    enteredBy?: string;
    paid: boolean;
}

// memberId/isMember are always recomputed server-side from email - never
// sent by the client, see course-registrations-service.ts on the API side.
// enteredBy is likewise always server-derived from the session.
export type CourseRegistrationCreationParams = Omit<
    CourseRegistration,
    'id' | 'tileId' | 'memberId' | 'isMember' | 'enteredBy'
>;
