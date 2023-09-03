/*
 * @copyright Copyright (c) 2022 Christian Silfang (comcy) - All Rights Reserved.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ComcyCopyrightComponent } from './comcy-copyright/comcy-copyright.component';
import { DatenschutzComponent } from './datenschutz';
import { BaseDialogComponent } from './dialogs/base-dialog/base-dialog.component';
import { FooterComponent } from './footer';
import { HeaderComponent } from './header';
import { ImpressumComponent } from './impressum';
import { InfoTileComponent } from './info-tile/info-tile.component';
import { NewsBannerComponent } from './news-banner/news-banner.component';
import { NewsCardComponent } from './news-card/news-card.component';
import { TopBarComponent } from './top-bar/top-bar.component';

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
    TopBarComponent,
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
    TopBarComponent
  ],
})
export class ComponentsModule { }
