import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeElementPipe } from './native-element';

@NgModule({
  declarations: [NativeElementPipe],
  imports: [CommonModule],
  exports: [NativeElementPipe],
})
export class PipesModule {}
