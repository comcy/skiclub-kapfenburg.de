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

import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppState } from './state/app.state';
import { NgxsModule, Store } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { MobileResolution } from './state/app.actions';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewsBannerComponent } from './modals/news-banner/news-banner.component';


export function initializeApp(store: Store) {
  return (): void => {
    console.log('### WIDTH >>>', window.innerWidth);
    if (window.innerWidth < 768) {
      store.dispatch(new MobileResolution({ isMobileResolution: true }));
    }
  };
}


@NgModule({
  declarations: [AppComponent, NewsBannerComponent],
  imports: [
    CommonModule,
    BrowserModule,
    NgxsModule.forRoot([AppState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [Store],
      multi: true
    },
  ],
  exports: [
    RouterModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
