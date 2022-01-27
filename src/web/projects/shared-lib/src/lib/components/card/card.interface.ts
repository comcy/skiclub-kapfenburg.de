export interface Card {
  active: boolean;
  title?: string;
  text?: string;
  date?: string;
  image?: string;
  type: CardType;
}

export enum CardType {
  'Image',
  'News',
}
