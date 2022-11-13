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
import { RegisterDialogComponent } from './dialogs/register-dialog/register-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TripRegistrationFormComponent } from './forms/trip-registration-form/trip-registration-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { TripRegisterDialogComponent } from './dialogs/trip-register-dialog/trip-register-dialog.component';
import { CourseRegisterFormComponent } from './forms/course-register-form/course-register-form.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ShareDialogComponent } from './dialogs/share-dialog/share-dialog.component';
import { InfoTileComponent } from './info-tile/info-tile.component';
import { BaseComponentsModule } from '../base-components/base-components.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DatenschutzComponent,
    ImpressumComponent,
    NewsBannerComponent,
    NewsCardComponent,
    RegisterDialogComponent,
    TripRegistrationFormComponent,
    TripRegisterDialogComponent,
    CourseRegisterFormComponent,
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
    BaseComponentsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    DatenschutzComponent,
    ImpressumComponent,
    NewsBannerComponent,
    NewsCardComponent,
    RegisterDialogComponent,
    TripRegistrationFormComponent,
    TripRegisterDialogComponent,
    CourseRegisterFormComponent,
  ],
})
export class ComponentsModule {}
