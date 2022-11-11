import { Component, Input } from '@angular/core';
import { CardType } from '.';
import { Card } from './card.interface';

@Component({
  selector: 'shared-lib-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() card?: Card = null;

  public assetPath = 'assets/img';
  public cardType = CardType;

  constructor() {
    console.log('>>> ', this.card);
  }

  public getImage(card: Card): string {
    if (card.image) {
      return `${this.assetPath}/${card.image}`;
    }
    return card.imageUrl;
  }

  public isNewsCardType(cardType: CardType): boolean {
    if (cardType === CardType.News) {
      return true;
    }
  }
}
