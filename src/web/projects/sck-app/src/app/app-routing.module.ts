import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatenschutzComponent } from 'projects/shared-lib/src/lib/components/datenschutz';
import { ImpressumComponent } from 'projects/shared-lib/src/lib/components/impressum';
import {
  CoursesComponent,
  GymComponent,
  HomeComponent,
  TripsComponent,
} from './components';
import {
  COURSES_ROUTE,
  DSGVO_ROUTE,
  EMPTY_ROUTE,
  GYM_ROUTE,
  HOME_ROUTE,
  IMPRESSUM_ROUTE,
  TRIPS_ROUTE,
} from './route-segments';

const routes: Routes = [
  {
    path: HOME_ROUTE,
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: COURSES_ROUTE,
    component: CoursesComponent,
  },
  {
    path: TRIPS_ROUTE,
    component: TripsComponent,
  },
  {
    path: GYM_ROUTE,
    component: GymComponent,
  },
  {
    path: IMPRESSUM_ROUTE,
    component: ImpressumComponent,
  },
  {
    path: DSGVO_ROUTE,
    component: DatenschutzComponent,
  },
  {
    path: EMPTY_ROUTE,
    pathMatch: 'full',
    redirectTo: HOME_ROUTE,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: HOME_ROUTE,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
