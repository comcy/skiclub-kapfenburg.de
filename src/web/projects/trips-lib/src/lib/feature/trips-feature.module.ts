import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripsDownloadsComponent } from './trips-downloads/trips-downloads.component';
import { TripsPricesComponent } from './trips-prices/trips-prices.component';
import { TripsInformationComponent } from './trips-information/trips-information.component';
import { TripsRegistrationComponent } from './trips-registration/trips-registration.component';
import { TripsUiModule } from '../ui/trips-ui.module';

@NgModule({
  declarations: [
    TripsDownloadsComponent,
    TripsPricesComponent,
    TripsInformationComponent,
    TripsRegistrationComponent,
  ],
  imports: [CommonModule, TripsUiModule],
  exports: [
    TripsDownloadsComponent,
    TripsInformationComponent,
    TripsPricesComponent,
    TripsRegistrationComponent,
  ],
})
export class TripsFeatureModule {}
