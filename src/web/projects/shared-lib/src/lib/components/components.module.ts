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
import { RegisterDialogComponent } from './dialogs/register-dialog/register-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShareDialogComponent } from './dialogs/share-dialog/share-dialog.component';
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
    RegisterDialogComponent,
    ShareDialogComponent,
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
    RegisterDialogComponent,
  ],
})
export class ComponentsModule {}
