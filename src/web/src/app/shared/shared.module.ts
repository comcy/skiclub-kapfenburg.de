/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CardComponent } from './components/card/card.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, CardComponent],
  imports: [CommonModule],
  exports: [HeaderComponent, FooterComponent, CardComponent],
})
export class SharedModule {}
