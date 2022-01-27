import { Component, Input } from '@angular/core';
import { Card } from './card.interface';

@Component({
  selector: 'shared-lib-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() card?: Card = null;

  constructor() {
    console.log('>>> ', this.card);
  }
}
