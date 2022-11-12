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
  expiration: Date;
}

export enum TileActions {
  Share = 'share',
  Register = 'register',
  Download = 'download',
}
