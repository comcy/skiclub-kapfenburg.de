/*
 * Copyright:
 *
 * Skiclub Kapfenburg e.V.
 * http://www.skiclub-kapfenburg.de
 *
 * This source code file is part of skiclub-kapfenburg.de.
 *
 * Copyright (c) 2019 - 2021 Christian Silfang (comcy) - All Rights Reserved.
 *  
 *
 * Created on 25. October 2021
 *
 */

import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { NewsVisibility } from 'src/app/state/app.actions';
import { AppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-news-banner',
  templateUrl: './news-banner.component.html',
  styleUrls: ['./news-banner.component.scss']
})
export class NewsBannerComponent implements OnInit {

  oneDriveLink = 'https://1drv.ms/b/s!AlpybhuWN2nhgeNuHja8yp2t5yNwQw';

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  public closeNews(): void {
    this.store.dispatch(new NewsVisibility({ visibility: false }));
  }


}
