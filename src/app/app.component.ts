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
 * Created on 21. October 2021
 *
 */

import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { MobileResolution, NewsVisibility } from './state/app.actions';
import { Router } from '@angular/router';
import { AppState } from './state/app.state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @Select(AppState.getNewsVisibilityStatus) news$;

  protected toDestroy$: Subject<boolean> = new Subject<boolean>();

  isNewsVisible = true;
  oneDriveLink = 'https://1drv.ms/b/s!AlpybhuWN2nhgeNuHja8yp2t5yNwQw';

  constructor(private store: Store, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    await this.checkResolution();
    // await this.newsBanner();
  }
  //
  // ngOnChanges(): void {
  //   this.news$
  //     .pipe(takeUntil(this.toDestroy$))
  //     .subscribe((visible) => {
  //       console.log('### visible ch ', visible);
  //       this.isNewsVisible = visible; // --> disabled NEWS banner
  //     });
  // }

  ngOnDestroy(): void {
    this.toDestroy$.next(true);
    this.toDestroy$.complete();
  }

  private async checkResolution(): Promise<void> {
    console.log('### WIDTH ', window.innerWidth);
    if (window.innerWidth < 768) {
      this.store.dispatch(new MobileResolution({isMobileResolution: true}));
      this.router.navigate(['mobile']);
    } else {
      this.router.navigate(['desktop']);
    }
  }

  // private async newsBanner(): Promise<void> {
  //
  //   this.news$
  //     .pipe(takeUntil(this.toDestroy$))
  //     .subscribe((visible) => {
  //       console.log('### visible ', visible);
  //       this.isNewsVisible = visible; // --> disabled NEWS banner
  //     });
  // }

  public async closeNews(): Promise<void> {

    console.log('### CLOSE ', this.isNewsVisible);
    const news = {visibility: false};
    this.store.dispatch(new NewsVisibility(news));
  }


}
