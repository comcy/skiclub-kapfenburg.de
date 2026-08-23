/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Same three values as trips-lib's client-side AgeCategory (trip-base.ts) -
// duplicated rather than imported, matching the existing sck-api convention
// of not depending on trips-lib's types (see domain/tile.ts's tripConfig
// comment).
export type AgeCategory = 'adult' | 'youthUntil16' | 'childUntil6';
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
  ageCategory: AgeCategory;
  isMember: boolean;
  status: RegistrationStatus;
  source: RegistrationSource;
  notes?: string;
  orderIndex: number;
}

// memberId and isMember are recomputed server-side from email on every
// write (see trip-registrations-service.ts) - never accepted from the client.
export type TripRegistrationCreationParams = Omit<TripRegistration, 'id' | 'tileId' | 'memberId' | 'isMember' | 'boardingName'>;
