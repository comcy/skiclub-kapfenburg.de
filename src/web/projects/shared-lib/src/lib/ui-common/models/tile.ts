/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { GymCourseInformation } from 'projects/gym-lib/src/lib/domain';
import { TripConfig } from 'projects/trips-lib/src/lib/domain/models/trip-config';

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

export interface BaseTile {
    id: string;
    order: number;
    title: string;
    date: string;
    subTitle: string;
    image: string;
    imageDescription: string;
    description: string;
    status: TileStatus;
    expiration: Date;
    behavior: TileBehavior;
    boardings?: string[];
    actions?: TileActions[];
    downloadActionLink?: string;
    avatar?: string;
    visible?: boolean;
    expired?: boolean;
}
export interface InfoTile extends BaseTile {
    type: TileType.Info;
    location?: string;
    timeData?: string[];
}

export interface CourseTile extends BaseTile {
    type: TileType.Course;
    course: GymCourseInformation;
    location: string;
}
export interface EventTile extends BaseTile {
    type: TileType.Event;
    tripConfig: TripConfig;
    destination?: string;
    location?: string;
    additionalInformation?: string;
}

export type Tile = InfoTile | CourseTile | EventTile;
