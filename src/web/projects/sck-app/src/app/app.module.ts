import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  ComponentsModule,
  CourseRegistrationFormServiceInterface,
  TripRegistrationFormServiceInterface,
} from 'projects/shared-lib/src/lib/components';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoursesComponent } from './components/courses/courses.component';
import { TripsComponent } from './components/trips/trips.component';
import { HomeComponent } from './components/home/home.component';
import { GymComponent } from './components/gym/gym.component';
import { SiteNavigationComponent } from './components/site-navigation/site-navigation.component';
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
import { HttpClientModule } from '@angular/common/http';
import {
  courseRegistrationServiceProvider,
  tripRegistrationServiceProvider,
} from './services';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CourseRegistrationComponent } from './components/courses/course-registration/course-registration.component';
import { InformationComponent } from './components/courses/information/information.component';

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    TripsComponent,
    HomeComponent,
    SiteNavigationComponent,
    GymComponent,
    CourseRegistrationComponent,
    InformationComponent,
  ],
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
  ],
  providers: [
    tripRegistrationServiceProvider,
    courseRegistrationServiceProvider,
    // {
    //   provide: MAT_DIALOG_DEFAULT_OPTIONS,
    //   useValue: { maxWidth: '90vw', hasBackdrop: true },
    // },
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
