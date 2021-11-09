/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.  
 */


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';

const desktopRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'skischule',
        component: HomeComponent
      },
      {
        path: 'ausfahrten',
        component: HomeComponent
      },
      {
        path: 'gymnastik',
        component: HomeComponent
      }
    ]
  },
  {
    path: 'impressum',
    component: ImpressumComponent
  },
  {
    path: 'datenschutz',
    component: DatenschutzComponent
  },
  {
    path: 'home',
    component: HomeComponent
  }

];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(desktopRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DesktopRoutingModule {}
