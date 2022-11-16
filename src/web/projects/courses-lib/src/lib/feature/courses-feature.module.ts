import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesPricesComponent } from './courses-prices/courses-prices.component';

@NgModule({
  declarations: [CoursesPricesComponent],
  imports: [CommonModule],
  exports: [CoursesPricesComponent],
})
export class CoursesFeatureModule {}
