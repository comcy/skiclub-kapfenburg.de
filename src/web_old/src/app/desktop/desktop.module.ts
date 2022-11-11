/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { DatenschutzComponent } from '../components/datenschutz/datenschutz.component';
import { ImpressumComponent } from '../components/impressum/impressum.component';
import { DesktopRoutingModule } from './desktop-routing.module';
import { NgxsModule } from '@ngxs/store';
import { AppState } from '../state/app.state';
import { SharedLibModule } from '@shared-lib/*';

@NgModule({
  declarations: [HomeComponent, DatenschutzComponent, ImpressumComponent],
  imports: [
    CommonModule,
    DesktopRoutingModule,
    NgxsModule.forFeature([AppState]),
    SharedLibModule,
  ],
  exports: [HomeComponent, DatenschutzComponent, ImpressumComponent],
})
export class DesktopModule {}
