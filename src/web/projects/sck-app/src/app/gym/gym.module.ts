/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GymRoutingModule } from './gym-routing.module';
import { GymComponent } from './gym.component';
import { InformationComponent } from './components/information/information.component';
import { GymFeatureModule } from '@gym-lib';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    declarations: [GymComponent, InformationComponent],
    imports: [CommonModule, GymRoutingModule, MatToolbarModule, GymFeatureModule],
})
export class GymModule {}
