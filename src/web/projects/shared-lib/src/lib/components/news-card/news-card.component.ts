/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input, OnInit } from '@angular/core';
import { NewsCardItem } from './news-card.interfaces';

@Component({
    selector: 'lib-news-card',
    templateUrl: './news-card.component.html',
    styleUrls: ['./news-card.component.scss'],
    standalone: false,
})
export class NewsCardComponent implements OnInit {
    @Input() newsCardItem!: NewsCardItem;

    public headerText!: string;
    public contentText!: string;

    ngOnInit(): void {
        this.headerText = this.newsCardItem.title;
        this.contentText = this.newsCardItem.content;
    }
}
