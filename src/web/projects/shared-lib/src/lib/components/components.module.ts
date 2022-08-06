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
import { TripRegistrationFormComponent } from './forms/trip-registration-form/trip-registration-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';

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
    TripRegistrationFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatSelectModule
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
    TripRegistrationFormComponent,
  ],
})
export class ComponentsModule {}
