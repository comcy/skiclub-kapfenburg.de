/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

export interface Tile {
    order: number;
    type: TileType;
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
