export enum TileType {
    Info = 'info',
    Event = 'event',
    Course = 'course',
}

// Karten-Management-Reiter: Ausfahrt (event MIT Anmeldung), Event (event ohne), Info.
export type TileKind = 'trip' | 'event' | 'info';

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

export const tileKindOf = (tile: { type: string; actions?: string[] }): TileKind =>
    tile.type === TileType.Info ? 'info' : tile.actions?.includes(TileActions.Register) ? 'trip' : 'event';
