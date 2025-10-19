/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesUiModule } from '../ui';
import { CoursesRegistrationComponent } from './courses-registration/courses-registration.component';
import { CoursesPricesComponent } from './courses-prices/courses-prices.component';
import { CoursesInformationComponent } from './courses-information/courses-information.component';

@NgModule({
    imports: [CommonModule, CoursesUiModule, CoursesPricesComponent, CoursesInformationComponent, CoursesRegistrationComponent],
    exports: [CoursesPricesComponent, CoursesInformationComponent, CoursesRegistrationComponent],
})
export class CoursesFeatureModule {}
