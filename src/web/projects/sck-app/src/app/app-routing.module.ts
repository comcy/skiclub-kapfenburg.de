import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CoursesInformationComponent,
  CoursesPricesComponent,
  CoursesRegistrationComponent,
} from '@components/courses';
import { DatenschutzComponent } from 'projects/shared-lib/src/lib/components/datenschutz';
import { ImpressumComponent } from 'projects/shared-lib/src/lib/components/impressum';
import {

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
    loadChildren: () =>
      import('./courses/courses.module').then((m) => m.CoursesModule)
  },
  // {
  //   path: COURSES_ROUTE,
  //   component: CoursesComponent,
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: 'registration',
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'registration',
  //       component: CoursesRegistrationComponent,
  //     },
  //     {
  //       path: 'information',
  //       component: CoursesInformationComponent,
  //     },
  //     {
  //       path: 'prices',
  //       component: CoursesPricesComponent,
  //     },
  //   ],
  // },
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
  // {
  //   path: '**',
  //   pathMatch: 'full',
  //   redirectTo: HOME_ROUTE,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
