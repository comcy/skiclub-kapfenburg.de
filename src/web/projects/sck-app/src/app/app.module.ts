import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  ComponentsModule,
  TripRegistrationFormServiceInterface,
} from 'projects/shared-lib/src/lib/components';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoursesComponent } from './courses/courses.component';
import { TripsComponent } from './trips/trips.component';
import { HomeComponent } from './home/home.component';
import { GymComponent } from './gym/gym.component';
import { SiteNavigationComponent } from './site-navigation/site-navigation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutModule } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { TripRegistrationFormService } from './services/business/trip-registration-form.service';

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    TripsComponent,
    HomeComponent,
    SiteNavigationComponent,
    GymComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    BrowserAnimationsModule,
    LayoutModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatSliderModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatCardModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: TripRegistrationFormServiceInterface,
      useClass: TripRegistrationFormService,
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { maxWidth: '90vw', hasBackdrop: true },
    },
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
