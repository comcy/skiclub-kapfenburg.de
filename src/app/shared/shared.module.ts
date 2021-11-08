/*
 * Copyright:
 *
 * Skiclub Kapfenburg e.V.
 * http://www.skiclub-kapfenburg.de
 *
 * This source code file is part of skiclub-kapfenburg.de.
 *
 * Copyright (c) 2019 - 2021 Christian Silfang (comcy) - All Rights Reserved.
 *  
 *
 * Created on 08. November 2021
 *
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ],
})
export class SharedModule { }
