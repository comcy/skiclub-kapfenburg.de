/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.
 */

import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Router } from '@angular/router';
import { AppState } from './state/app.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  AUSFAHRTEN_ROUTE_SEGMENT,
  DESKTOP_BASE_ROUTE,
  GYMNASTIK_ROUTE_SEGMENT,
  HOME_ROUTE_SEGMENT,
  MOBILE_BASE_ROUTE,
  NEWS_ROUTE_SEGMENT,
  SKISCHULE_ROUTE_SEGMENT,
} from './route-segments';
import { NavigationItem } from '@shared-lib/*';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @Select(AppState.getNewsVisibilityStatus)
  newsVisibility$: Observable<boolean>;
  @Select(AppState.getMobileResolutionStatus)
  isMobileResolution$: Observable<boolean>;

  baseRoute: string = '';
  navItems: NavigationItem[] = [];

  private desktopNavItems: NavigationItem[] = [
    // { name: 'Skiclub Kapfenburg e.V.', route: HOME_ROUTE_SEGMENT },
    { name: 'Termine', route: NEWS_ROUTE_SEGMENT },
    { name: 'Skischule', route: SKISCHULE_ROUTE_SEGMENT },
    { name: 'Ausfahrten', route: AUSFAHRTEN_ROUTE_SEGMENT },
    { name: 'Gymnastik', route: GYMNASTIK_ROUTE_SEGMENT },
  ];

  private mobileNavItems: NavigationItem[] = [];
  private toDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    let routePath = DESKTOP_BASE_ROUTE;
    this.navItems = this.desktopNavItems;
    this.baseRoute = DESKTOP_BASE_ROUTE;
    this.isMobileResolution$
      .pipe(takeUntil(this.toDestroy$))
      .subscribe((mobile: boolean) => {
        if (mobile) {
          routePath = MOBILE_BASE_ROUTE;
          this.navItems = this.mobileNavItems;
          this.baseRoute = MOBILE_BASE_ROUTE;
        }
        this.router.navigate([routePath]);
      });
  }

  ngOnDestroy(): void {
    this.toDestroy$.next(true);
    this.toDestroy$.complete();
  }
}
