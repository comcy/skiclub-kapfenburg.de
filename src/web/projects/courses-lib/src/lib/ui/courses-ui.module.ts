import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseRegistrationFormComponent } from './course-registration-form/course-registration-form.component';

@NgModule({
  declarations: [CourseRegistrationFormComponent],
  imports: [CommonModule],
  exports: [CourseRegistrationFormComponent],
})
export class CoursesUiModule {}
