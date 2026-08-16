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
}

export type TileCreationParams = Omit<Tile, 'id'>;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}
