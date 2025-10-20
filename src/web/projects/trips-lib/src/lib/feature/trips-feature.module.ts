/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripsDownloadsComponent } from './trips-downloads/trips-downloads.component';
import { TripsPricesComponent } from './trips-prices/trips-prices.component';
import { TripsInformationComponent } from './trips-information/trips-information.component';
import { TripsRegistrationComponent } from './trips-registration/trips-registration.component';
import { TripsUiModule } from '../ui/trips-ui.module';
import { ComponentsModule } from 'projects/shared-lib/src/lib/components';
import { TripsRegisterDialogComponent } from './trips-register-dialog/trips-register-dialog.component';

@NgModule({
    imports: [CommonModule, TripsUiModule, ComponentsModule, TripsDownloadsComponent,
        TripsPricesComponent,
        TripsInformationComponent,
        TripsRegistrationComponent,
        TripsRegisterDialogComponent],
    exports: [
        TripsDownloadsComponent,
        TripsInformationComponent,
        TripsPricesComponent,
        TripsRegistrationComponent,
        TripsRegisterDialogComponent,
    ],
})
export class TripsFeatureModule {}
