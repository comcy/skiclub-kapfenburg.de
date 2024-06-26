/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { MobileRoutingModule } from './mobile-routing.module';
import { SharedLibModule } from 'projects/shared-lib/src/lib/shared-lib.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, MobileRoutingModule, SharedLibModule],
  exports: [HomeComponent],
})
export class MobileModule {}
