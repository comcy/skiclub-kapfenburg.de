import { Component, Input, OnInit } from '@angular/core';
import { NewsCardItem } from './news-card.interfaces';

@Component({
  selector: 'lib-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss'],
})
export class NewsCardComponent implements OnInit {
  @Input() newsCardItem!: NewsCardItem;

  public headerText!: string;
  public contentText!: string;

  constructor() {}

  ngOnInit(): void {
    this.headerText = this.newsCardItem.title;
    this.contentText = this.newsCardItem.content;
  }
}
