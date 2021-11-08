/*
 * Copyright:
 *
 * Skiclub Kapfenburg e.V.
 * http://www.skiclub-kapfenburg.de
 *
 * This source code file is part of skiclub-kapfenburg.de.
 *
 * Copyright (c) 2019 - 2021 Christian Silfang (comcy) - All Rights Reserved.
 *  
 *
 * Created on 24. October 2021
 *
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../mobile/components/home/home.component';

const mobileRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(mobileRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class MobileRoutingModule {}
