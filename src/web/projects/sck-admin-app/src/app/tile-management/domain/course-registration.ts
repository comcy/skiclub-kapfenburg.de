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
}

// memberId/isMember are always recomputed server-side from email - never
// sent by the client, see course-registrations-service.ts on the API side.
export type CourseRegistrationCreationParams = Omit<CourseRegistration, 'id' | 'tileId' | 'memberId' | 'isMember'>;
