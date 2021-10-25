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

import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { AppComponent } from './app.component';
import { AppState } from './state/app.state';

const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    pathMatch: 'full'
  },
  {
    path: 'desktop',
    loadChildren: () => import('./desktop/desktop.module').then((m) => m.DesktopModule)
  },
  {
    path: 'mobile',
    loadChildren: () => import('./mobile/mobile.module').then((m) => m.MobileModule)
  }
];

@NgModule({
  imports: [
    RouterModule,
    RouterModule.forRoot(appRoutes, {useHash: true, scrollPositionRestoration: 'enabled', onSameUrlNavigation: 'reload'})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
