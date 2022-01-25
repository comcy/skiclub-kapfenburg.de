interface Card {
  active: boolean;
}

export interface NewsCard extends Card {
  title: string;
  text: string;
  date: Date;
  image?: string;
}

export interface ImageCard extends Card {
  image?: string;
}
