import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatenschutzComponent } from 'projects/shared-lib/src/lib/components/datenschutz';
import { ImpressumComponent } from 'projects/shared-lib/src/lib/components/impressum';
import { CoursesComponent } from './courses/courses.component';
import { HomeComponent } from './home/home.component';
import { COURSES_ROUTE, DSGVO_ROUTE, IMPRESSUM_ROUTE, TRIPS_ROUTE } from './route-segments';
import { TripsComponent } from './trips/trips.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full',
    children: [
      {
        path: COURSES_ROUTE,
        component: CoursesComponent
      },
      {
        path: TRIPS_ROUTE,
        component: TripsComponent
      }
    ]
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
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
