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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { MobileResolution } from './state/app.actions';
import { Router } from '@angular/router';
import { AppState } from './state/app.state';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @Select(AppState.getNewsVisibilityStatus) newsVisibility$: Observable<boolean>;
  @Select(AppState.getMobileResolutionStatus) isMobileResolution$: Observable<boolean>;


  protected toDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    let routePath = 'desktop';
    this.isMobileResolution$
      .pipe(takeUntil(this.toDestroy$))
      .subscribe((mobile: boolean) => {
        if (mobile) {
          routePath = 'mobile';
        }

        this.router.navigate([routePath]);
      });
  }

  ngOnDestroy(): void {
    this.toDestroy$.next(true);
    this.toDestroy$.complete();
  }

}

function takeUntil(toDestroy$: Subject<boolean>): import("rxjs").OperatorFunction<boolean, unknown> {
  throw new Error('Function not implemented.');
}

