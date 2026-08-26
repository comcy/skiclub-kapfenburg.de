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
  // Admin email who created the row - set once server-side from the
  // authenticated session (see the controller), never client-supplied.
  // undefined for public self-registrations (no admin author).
  enteredBy?: string;
  paid: boolean;
}

// memberId and isMember are recomputed server-side from email on every
// write (see course-registrations-service.ts) - never accepted from the
// client. enteredBy is likewise always server-derived, never trusted from
// the client - see createRegistration's separate enteredBy parameter.
export type CourseRegistrationCreationParams = Omit<
  CourseRegistration,
  'id' | 'tileId' | 'memberId' | 'isMember' | 'enteredBy'
>;

export interface CourseGroup {
  id: string;
  tileId: string;
  name: string;
  instructorName?: string;
  createdAt: string;
}

export type CourseGroupCreationParams = Omit<CourseGroup, 'id' | 'tileId' | 'createdAt'>;
