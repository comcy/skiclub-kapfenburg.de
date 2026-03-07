/**
 * @copyright Copyright (c) 2025 Christian Silfang
 */

import { TripConfig } from './trip-config';
import { GymCourseInformation } from './gym-course-information';
import { TileActions, TileBehavior, TileStatus, TileType } from './tile-enums';

export interface Tile {
    id: string;
    order: number;
    type: TileType;
    title: string;
    date: string;
    subTitle: string;
    image: string;
    imageId?: string; // Optional: reference to the Image ID
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

    // Event specific fields (from EventTile in web)
    tripConfig?: TripConfig;
    destination?: string;
    location?: string;
    additionalInformation?: string;

    // Course specific fields (from CourseTile in web)
    course?: GymCourseInformation;
}

export type TileCreationParams = Omit<Tile, 'id'>;
