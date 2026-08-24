import type { ApiPilatesCourseDto } from 'projects/courses-lib/src/lib/api/course-tiles-api.interface';
import type { CourseConfig } from 'projects/courses-lib/src/lib/domain/models/course-config';
import type { TripConfig } from 'projects/trips-lib/src/lib/domain/models/trip-config';
import { TileActions, TileBehavior, TileStatus, TileType } from './tile-enums';

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
    // Public "Termine"/details markdown block for course tiles (see
    // course-detail.component.html's `tile.details`) - distinct from
    // course.details (GymCourseInformation), never edited separately.
    details?: string;
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
    // Real tiles columns (Phase 2 of the trip-registration plan) — capacity
    // is nullable (unlimited), organizerUserId a plain informational
    // reference to a users.id, no access-control implications (see the plan).
    capacity?: number;
    organizerUserId?: string;
    // Still opaque passthrough in extra_json server-side (see EXTRA_FIELD_KEYS
    // in sck-api's domain/tile.ts) — typed here now that the editor actually
    // reads/writes into it, previously round-tripped completely blind.
    tripConfig?: TripConfig;
    // Kurse section (see fixedType in tile-list/tile-editor) — BCC config,
    // shared by ski-level and Pilates course tiles.
    courseConfig?: CourseConfig;
    // Pilates/Gymnastik-specific rich content (time/location/contact/prices/
    // schedule) — only ever set when the admin turns on "Dies ist ein
    // Pilates-/Gymnastik-Kurs" in the editor; ski-level tiles never get this.
    // Same wire shape sck-app reads back (dates as ISO strings), see
    // ApiPilatesCourseDto.
    course?: ApiPilatesCourseDto;
}

export type TileCreationParams = Omit<Tile, 'id'>;
