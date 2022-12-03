import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationComponent } from './components/information/information.component';
import { GymComponent } from './gym.component';

const routes: Routes = [

  {
    path: '',
    component: GymComponent,
    children: [
      {
        path: '',
        redirectTo: 'information',
        pathMatch: 'full',
      },
      {
        path: 'information',
        component: InformationComponent,
      }
    ],
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GymRoutingModule { }


