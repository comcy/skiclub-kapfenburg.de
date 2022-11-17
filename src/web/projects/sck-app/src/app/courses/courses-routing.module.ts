import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationComponent } from './components/tabs/information/information.component';
import { PricesComponent } from './components/tabs/prices/prices.component';
import { RegistrationComponent } from './components/tabs/registration/registration.component';
import { CoursesComponent } from './courses.component';

const routes: Routes = [

  {
    path: '',
    component: CoursesComponent,
    children: [
      {
        path: '',
        redirectTo: 'resgistration',
        pathMatch: 'full',
      },
      {
        path: 'resgistration',
        component: RegistrationComponent,
      },
      {
        path: 'information',
        component: InformationComponent,
      },
      {
        path: 'prices',
        component: PricesComponent,
      },
    ],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
