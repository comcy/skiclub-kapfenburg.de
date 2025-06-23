/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoursesFeatureModule } from '@courses-lib';
import { GymFeatureModule } from '@gym-lib';
import { ComcyCopyrightComponent, SiteHeaderComponent, SiteNavigationComponent } from '@shared/ui-common';
import { TripsFeatureModule } from '@trips-lib';
import { ComponentsModule } from 'projects/shared-lib/src/lib/components';
import {
    FacebookButtonComponent,
    InstagramButtonComponent,
    MailButtonComponent,
} from 'projects/shared-lib/src/lib/ui-common/components/buttons';
import { BaseButtonComponent } from 'projects/shared-lib/src/lib/ui-common/components/buttons/base-button/base-button.component';
import { SckLogoIconComponent } from 'projects/shared-lib/src/lib/ui-common/components/icons';
import { InstagramIconComponent } from 'projects/shared-lib/src/lib/ui-common/components/icons/instagram-icon';
import { SiteFooterComponent } from 'projects/shared-lib/src/lib/ui-common/components/site-footer/site-footer.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { courseRegistrationServiceProvider } from './services/business/course-registration-form.service';
import { gymCoursesRegisterFormServiceProvider } from './services/business/gym-courses-registration-form.service';
import { tripRegistrationServiceProvider } from './services/business/trip-registration-form.service';

@NgModule({
    declarations: [AppComponent],
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
        gymCoursesRegisterFormServiceProvider,
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: { maxWidth: '90vw', hasBackdrop: true },
        },
    ],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
