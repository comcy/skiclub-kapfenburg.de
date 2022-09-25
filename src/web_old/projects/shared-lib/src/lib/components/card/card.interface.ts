export interface Card {
  active: boolean;
  title?: string;
  text?: string;
  date?: string;
  image?: string;
  imageUrl?: string;
  type: CardType;
}

export enum CardType {
  'Image',
  'News',
}
