import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GymRoutingModule } from './gym-routing.module';
import { GymComponent } from './gym.component';
import { InformationComponent } from './components/information/information.component';
import { GymFeatureModule } from '@gym-lib';


@NgModule({
  declarations: [
    GymComponent,
    InformationComponent,
  ],
  imports: [
    CommonModule,
    GymRoutingModule,
    GymFeatureModule
  ]
})
export class GymModule { }
