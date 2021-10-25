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
 * Created on 24. October 2021
 *
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { NewsComponent } from './components/news/news.component';
import { HeaderComponent } from './components/home/header/header.component';
import { FooterComponent } from './components/home/footer/footer.component';
import { DesktopRoutingModule } from './desktop-routing.module';
import { NgxsModule } from '@ngxs/store';
import { AppState } from '../state/app.state';


@NgModule({
  declarations: [
    HomeComponent,
    DatenschutzComponent,
    ImpressumComponent,
    NewsComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    DesktopRoutingModule,
    NgxsModule.forFeature([AppState]),
  ],
  exports: [
    HomeComponent,
    DatenschutzComponent,
    ImpressumComponent,
    NewsComponent,
    HeaderComponent,
    FooterComponent,
  ]
})
export class DesktopModule { }
