import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesPricesComponent } from './courses-prices/courses-prices.component';
import { CoursesInformationComponent } from './courses-information/courses-information.component';
import { CoursesRegistrationComponent } from './courses-registration/courses-registration.component';

@NgModule({
  declarations: [
    CoursesPricesComponent,
    CoursesInformationComponent,
    CoursesRegistrationComponent,
  ],
  imports: [CommonModule],
  exports: [
    CoursesPricesComponent,
    CoursesInformationComponent,
    CoursesRegistrationComponent,
  ],
})
export class CoursesFeatureModule {}
