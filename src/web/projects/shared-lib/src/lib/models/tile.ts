export interface Tile {
  order: number;
  title: string;
  date: string;
  subTitle: string;
  image: string;
  imageDescription: string;
  text: string;
  actions?: TileActions[];
  avatar?: string;
  visible?: boolean;
  expired?: boolean;
  canceled?: boolean;
  expiration: Date;
  behavior: TileBehavior;
  boardings: string[];
}

export enum TileActions {
  Share = 'share',
  Register = 'register',
}

export enum TileBehavior {
  View = 'view',
  Click = 'click',
}
