/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.  
 */


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { MobileRoutingModule } from './mobile-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    MobileRoutingModule,
    SharedModule
  ], exports: [
    HomeComponent
  ]
})export class MobileModule { }

