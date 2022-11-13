import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { COURSES_ROUTE } from '../route-segments';
import { CoursesInformationComponent, CoursesPricesComponent, CoursesRegistrationComponent } from './components';
import { CoursesComponent } from './courses.component';

const routes: Routes = [
  {
    path: COURSES_ROUTE,
    component: CoursesComponent,
    children: [
      {
        path: '',
        redirectTo: 'registration',
        pathMatch: 'full',
      },
      {
        path: 'registration',
        component: CoursesRegistrationComponent,
      },
      {
        path: 'information',
        component: CoursesInformationComponent,
      },
      {
        path: 'prices',
        component: CoursesPricesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
