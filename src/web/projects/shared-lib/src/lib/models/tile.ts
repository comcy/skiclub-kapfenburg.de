export interface Tile {
  order?: number;
  title: string;
  date: string;
  subTitle: string;
  image: string;
  imageDescription: string;
  text: string;
  actions?: TileActions[];
  avatar?: string;
}

export enum TileActions {
  Share = 'share',
  Register = 'register',
}
