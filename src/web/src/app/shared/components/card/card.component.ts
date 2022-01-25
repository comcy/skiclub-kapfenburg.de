import { Component, Input } from '@angular/core';
import { ImageCard, NewsCard } from '@components/*';

@Component({
  selector: 'shared-lib-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() card: NewsCard | ImageCard = null;

  constructor() {
    console.log('>>> ', this.card);
  }
}
