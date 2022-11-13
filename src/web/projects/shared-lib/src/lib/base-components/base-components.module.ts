import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComcyCopyrightComponent } from './comcy-copyright/comcy-copyright.component';



@NgModule({
  declarations: [ComcyCopyrightComponent],
  imports: [
    CommonModule
  ],
  exports:[ComcyCopyrightComponent]
})
export class BaseComponentsModule { }
