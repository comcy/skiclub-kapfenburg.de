/*
 * @copyright Copyright (c) 2022 Christian Silfang (comcy) - All Rights Reserved.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header';
import { FooterComponent } from './footer';
import { DatenschutzComponent } from './datenschutz';
import { ImpressumComponent } from './impressum';
import { NewsBannerComponent } from './news-banner/news-banner.component';
import { NewsCardComponent } from './news-card/news-card.component';
import { ComcyCopyrightComponent } from './comcy-copyright/comcy-copyright.component';
import { BaseDialogComponent } from './dialogs/base-dialog/base-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfoTileComponent } from './info-tile/info-tile.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DatenschutzComponent,
    ImpressumComponent,
    NewsBannerComponent,
    NewsCardComponent,
    ComcyCopyrightComponent,
    BaseDialogComponent,
    InfoTileComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatSelectModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    DatenschutzComponent,
    ImpressumComponent,
    NewsBannerComponent,
    NewsCardComponent,
    ComcyCopyrightComponent,
    BaseDialogComponent,
  ],
})
export class ComponentsModule {}
