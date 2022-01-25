import { Component, Input, OnInit } from '@angular/core';
import { Card, ImageCard, NewsCard } from './card.interface';

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
