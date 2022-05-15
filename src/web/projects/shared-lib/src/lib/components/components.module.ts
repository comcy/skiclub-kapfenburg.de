/*
 * @copyright Copyright (c) 2022 Christian Silfang (comcy) - All Rights Reserved.  
 */


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header';
import { FooterComponent } from './footer';
import { DatenschutzComponent } from './datenschutz';
import { ImpressumComponent } from './impressum';
import { NewsBannerComponent } from './news-banner/news-banner.component';
import { NewsCardComponent } from './news-card/news-card.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DatenschutzComponent,
    ImpressumComponent,
    NewsBannerComponent,
    NewsCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    DatenschutzComponent,
    ImpressumComponent,
    NewsBannerComponent,
    NewsCardComponent
  ]
})
export class ComponentsModule { }
