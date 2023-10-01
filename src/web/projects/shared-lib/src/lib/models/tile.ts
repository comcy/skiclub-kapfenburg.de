/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

export interface Tile {
    order: number;
    title: string;
    date: string;
    subTitle: string;
    image: string;
    imageDescription: string;
    text: string;
    status: TileStatus;
    expiration: Date;
    behavior: TileBehavior;
    boardings: string[];
    actions?: TileActions[];
    downloadActionLink?: string;
    avatar?: string;
    visible?: boolean;
    expired?: boolean;
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
