import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripsRoutingModule } from './trips-routing.module';
import { RegistrationComponent } from './components/tabs/registration/registration.component';
import { InformationComponent } from './components/tabs/information/information.component';
import { PricesComponent } from './components/tabs/prices/prices.component';
import { DownloadsComponent } from './components/tabs/downloads/downloads.component';
import { TripsComponent } from './trips.component';


@NgModule({
  declarations: [
    RegistrationComponent,
    InformationComponent,
    PricesComponent,
    DownloadsComponent,
    TripsComponent
  ],
  imports: [
    CommonModule,
    TripsRoutingModule
  ]
})
export class TripsModule { }
