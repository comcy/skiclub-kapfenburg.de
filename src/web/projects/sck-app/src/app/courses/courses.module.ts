import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';
import { CoursesInformationComponent } from './components/courses-information/courses-information.component';
import { CoursesPricesComponent } from './components/courses-prices/courses-prices.component';
import { CoursesRegistrationComponent } from './components/courses-registration/courses-registration.component';

@NgModule({
  declarations: [
    CoursesComponent,
    CoursesInformationComponent,
    CoursesPricesComponent,
    CoursesRegistrationComponent,
  ],
  imports: [CommonModule, CoursesRoutingModule],
})
export class CoursesModule {}
