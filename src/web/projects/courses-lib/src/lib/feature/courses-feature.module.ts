import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesUiModule } from '../ui';
import { CoursesRegistrationComponent } from './courses-registration/courses-registration.component';
import { CoursesPricesComponent } from './courses-prices/courses-prices.component';
import { CoursesInformationComponent } from './courses-information/courses-information.component';

@NgModule({
  declarations: [
    CoursesPricesComponent,
    CoursesInformationComponent,
    CoursesRegistrationComponent,
  ],
  imports: [CommonModule, CoursesUiModule],
  exports: [
    CoursesPricesComponent,
    CoursesInformationComponent,
    CoursesRegistrationComponent,
  ],
})
export class CoursesFeatureModule {}
