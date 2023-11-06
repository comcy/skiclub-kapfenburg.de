/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from 'projects/shared-lib/src/lib/components';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutModule } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { tripRegistrationServiceProvider } from './services/business/trip-registration-form.service';
import { courseRegistrationServiceProvider } from './services/business/course-registration-form.service';
import { CoursesFeatureModule } from '@courses-lib';
import { GymFeatureModule } from '@gym-lib';
import { TripsFeatureModule } from '@trips-lib';
import { ComcyCopyrightComponent, SiteHeaderComponent, SiteNavigationComponent } from '@shared/ui-common';
import { SiteFooterComponent } from 'projects/shared-lib/src/lib/ui-common/components/site-footer/site-footer.component';
import {
    FacebookButtonComponent,
    InstagramButtonComponent,
    MailButtonComponent,
} from 'projects/shared-lib/src/lib/ui-common/components/buttons';
import { SckLogoIconComponent } from 'projects/shared-lib/src/lib/ui-common/components/icons';
import { BaseButtonComponent } from 'projects/shared-lib/src/lib/ui-common/components/buttons/base-button/base-button.component';
import { InstagramIconComponent } from 'projects/shared-lib/src/lib/ui-common/components/icons/instagram-icon';

@NgModule({
    declarations: [AppComponent, HomeComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ComponentsModule,
        BrowserAnimationsModule,
        LayoutModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatSidenavModule,
        MatListModule,
        MatSliderModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        CoursesFeatureModule,
        GymFeatureModule,
        TripsFeatureModule,
        SiteNavigationComponent,
        SiteHeaderComponent,
        SiteFooterComponent,
        ComcyCopyrightComponent,
        MailButtonComponent,
        SckLogoIconComponent,
        BaseButtonComponent,
        FacebookButtonComponent,
        InstagramButtonComponent,
        InstagramIconComponent,
        SckLogoIconComponent,
    ],
    providers: [
        tripRegistrationServiceProvider,
        courseRegistrationServiceProvider,
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: { maxWidth: '90vw', hasBackdrop: true },
        },
    ],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
