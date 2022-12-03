import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GymGeneralInformationComponent } from './gym-general-information/gym-general-information.component';
import { MatToolbarModule } from '@angular/material/toolbar';



@NgModule({
  declarations: [GymGeneralInformationComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
  ],
  exports: [GymGeneralInformationComponent]

})
export class GymFeatureModule { }
