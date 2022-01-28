import { Component, Input } from '@angular/core';
import { Card } from './card.interface';

@Component({
  selector: 'shared-lib-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() card?: Card = null;

  assetPath = 'assets/img';

  constructor() {
    console.log('>>> ', this.card);
  }

  getImage(img: string): string {
    return `${this.assetPath}/${img}`;
  }
}
