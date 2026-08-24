/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// No 'waitlist' - courses have no capacity concept (see the plan), unlike
// trip-registration.ts's RegistrationStatus.
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

// memberId and isMember are recomputed server-side from email on every
// write (see course-registrations-service.ts) - never accepted from the client.
export type CourseRegistrationCreationParams = Omit<CourseRegistration, 'id' | 'tileId' | 'memberId' | 'isMember'>;

export interface CourseGroup {
  id: string;
  tileId: string;
  name: string;
  instructorName?: string;
  createdAt: string;
}

export type CourseGroupCreationParams = Omit<CourseGroup, 'id' | 'tileId' | 'createdAt'>;
