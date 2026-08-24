/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

// Mirrors src/web/projects/sck-admin-app/src/app/tile-management/domain/tile.ts
// and tile-enums.ts — this is the API's wire contract, kept in sync by hand
// since sck-api and the Angular apps are separate TypeScript projects.

export enum TileType {
  Info = 'info',
  Event = 'event',
  Course = 'course',
}

export enum TileActions {
  Share = 'share',
  Register = 'register',
  Download = 'download',
}

export enum TileBehavior {
  View = 'view',
  Click = 'click',
}

export enum TileStatus {
  Open = 'open',
  Canceled = 'canceled',
  BookedUp = 'bookedUp',
}

export interface Tile {
  id: string;
  order: number;
  type: TileType;
  title: string;
  date: string;
  subTitle: string;
  image: string;
  imageId?: string;
  imageDescription: string;
  description: string;
  status: TileStatus;
  expiration: string;
  behavior: TileBehavior;
  boardings?: string[];
  actions?: TileActions[];
  downloadActionLink?: string;
  avatar?: string;
  visible?: boolean;
  expired?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Real tiles columns (Phase 2 of the trip-registration plan) — capacity is
  // nullable (unlimited), organizerUserId a plain informational reference to
  // a users.id with no access-control implications (see the plan).
  capacity?: number;
  organizerUserId?: string;
  // Computed, not stored - COUNT of trip_registrations with status='confirmed'
  // for this tile, only populated for type='event'. Public-safe: a bare
  // number, no registrant PII, used to derive the "Warteliste" badge on the
  // public site without needing a live-registrations read endpoint there.
  confirmedRegistrationsCount?: number;
  // Opaque passthrough, stored in `tiles.extra_json` — owned by the richer
  // sck-app Tile union (EventTile/CourseTile/InfoTile in
  // shared-lib/ui-common/models), not validated or edited here. Typed
  // `unknown` rather than mirroring TripConfig/GymCourseInformation by hand:
  // sck-api never reads inside these, only round-trips them, and a second
  // hand-kept copy of those shapes is exactly the drift this exists to avoid.
  details?: string;
  location?: string;
  timeData?: string[];
  destination?: string;
  additionalInformation?: string;
  tripConfig?: unknown;
  course?: unknown;
  // BCC config for the ski-course/gym-course admin section - see courseConfig
  // in sck-admin-app's tile domain (CourseConfig, courses-lib). Deliberately
  // separate from `course` (GymCourseInformation, a required display-shaped
  // object) - ski-level tiles have no display use for that shape.
  courseConfig?: unknown;
}

// The subset of Tile that lives in `extra_json` rather than its own column.
export const EXTRA_FIELD_KEYS = [
  'details',
  'location',
  'timeData',
  'destination',
  'additionalInformation',
  'tripConfig',
  'course',
  'courseConfig',
] as const satisfies readonly (keyof Tile)[];

export type TileCreationParams = Omit<Tile, 'id'>;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}
