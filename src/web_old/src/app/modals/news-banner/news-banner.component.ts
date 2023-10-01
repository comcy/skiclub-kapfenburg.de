/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { NewsVisibility } from 'src/app/state/app.actions';
import { AppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-news-banner',
  templateUrl: './news-banner.component.html',
  styleUrls: ['./news-banner.component.scss'],
})
export class NewsBannerComponent implements OnInit {
  oneDriveLink = 'https://1drv.ms/b/s!AlpybhuWN2nhgeNuHja8yp2t5yNwQw';

  constructor(private store: Store) {}

  ngOnInit(): void {}

  public closeNews(): void {
    this.store.dispatch(new NewsVisibility({ visibility: false }));
  }
}
