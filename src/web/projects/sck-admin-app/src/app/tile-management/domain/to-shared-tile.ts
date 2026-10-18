import {
    CourseTile as SharedCourseTile,
    EventTile as SharedEventTile,
    InfoTile as SharedInfoTile,
    Tile as SharedTile,
    TileActions as SharedTileActions,
    TileBehavior as SharedTileBehavior,
    TileStatus as SharedTileStatus,
    TileType as SharedTileType,
} from '@shared/ui-common';
import { GymCourseInformation } from 'projects/gym-lib/src/lib/domain';
import { Tile } from './tile';

const DATE_FORMAT = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

// The admin editor stores a raw ISO date, but the public Tile.date field is
// a pre-formatted display string ("28. Dezember 2026") - shared-lib-tile-card
// shows it as-is, no further parsing. Format here so the preview matches
// what visitors actually see instead of a raw ISO string.
function formatDisplayDate(isoDate: string): string {
    const parsed = new Date(isoDate);
    return Number.isNaN(parsed.getTime()) ? isoDate : DATE_FORMAT.format(parsed);
}

// Maps the admin app's own flat Tile shape onto shared-lib's discriminated
// Tile union, purely so both apps can render the same shared-lib-tile-card
// component (see the tile-card unification plan) - no new behavior, just a
// reshape. The two Tile declarations' enums are separately declared but
// string-value-identical, so member values pass through as-is (cast, since
// TS treats separately-declared enums as nominally distinct types even when
// their values match).
export function toSharedTile(tile: Tile): SharedTile {
    const base = {
        id: tile.id,
        order: tile.order,
        title: tile.title,
        date: formatDisplayDate(tile.date),
        subTitle: tile.subTitle,
        image: tile.image,
        imageDescription: tile.imageDescription,
        description: tile.description,
        details: tile.details ?? '',
        status: tile.status as unknown as SharedTileStatus,
        expiration: new Date(tile.expiration),
        behavior: tile.behavior as unknown as SharedTileBehavior,
        boardings: tile.boardings,
        actions: tile.actions as unknown as SharedTileActions[] | undefined,
        downloadActionLink: tile.downloadActionLink,
        avatar: tile.avatar,
        visible: tile.visible,
        expired: tile.expired,
        imageOnly: false,
    };

    if (tile.tripConfig) {
        return {
            ...base,
            type: SharedTileType.Event,
            tripConfig: tile.tripConfig,
            destination: tile.destination,
            capacity: tile.capacity,
            confirmedRegistrationsCount: tile.confirmedRegistrationsCount,
        } satisfies SharedEventTile;
    }

    if (tile.course) {
        return {
            ...base,
            type: SharedTileType.Course,
            course: tile.course as unknown as GymCourseInformation,
            location: tile.course.location,
        } satisfies SharedCourseTile;
    }

    return {
        ...base,
        type: SharedTileType.Info,
    } satisfies SharedInfoTile;
}
