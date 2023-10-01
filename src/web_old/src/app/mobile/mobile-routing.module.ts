/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../mobile/components/home/home.component';

const mobileRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(mobileRoutes)],
  exports: [RouterModule],
})
export class MobileRoutingModule {}
