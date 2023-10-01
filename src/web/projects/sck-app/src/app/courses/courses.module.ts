/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesRoutingModule } from './courses-routing.module';
import { RegistrationComponent } from './components/tabs/registration/registration.component';
import { PricesComponent } from './components/tabs/prices/prices.component';
import { InformationComponent } from './components/tabs/information/information.component';
import { CoursesComponent } from './courses.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CoursesFeatureModule, CoursesUiModule } from '@courses-lib';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ComponentsModule } from 'projects/shared-lib/src/public-api';

@NgModule({
    declarations: [RegistrationComponent, PricesComponent, InformationComponent, CoursesComponent],
    imports: [
        CommonModule,
        CoursesRoutingModule,
        MatTabsModule,
        MatToolbarModule,
        CoursesFeatureModule,
        CoursesUiModule,
        ComponentsModule,
    ],
})
export class CoursesModule {}
