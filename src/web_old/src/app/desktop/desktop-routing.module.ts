/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.  
 */


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const desktopRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
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
export class DesktopRoutingModule { }
