/*
 * @copyright Copyright (c) 2022 Christian Silfang (comcy) - All Rights Reserved.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CoursesRegisterFormComponent } from './child/courses-register-form';
import {
  CoursesInformationComponent,
  CoursesPricesComponent,
  CoursesRegistrationComponent,
} from './main';

@NgModule({
  declarations: [
    CoursesInformationComponent,
    CoursesPricesComponent,
    CoursesRegistrationComponent,
    CoursesRegisterFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatSelectModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    CoursesInformationComponent,
    CoursesPricesComponent,
    CoursesRegistrationComponent,
    CoursesRegisterFormComponent,
  ],
})
export class CoursesModule {}
