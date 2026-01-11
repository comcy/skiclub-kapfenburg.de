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
}

export type TileCreationParams = Omit<Tile, 'id'>;