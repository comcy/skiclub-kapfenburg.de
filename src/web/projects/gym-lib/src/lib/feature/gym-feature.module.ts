/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GymGeneralInformationComponent } from './gym-general-information/gym-general-information.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GymInformationProviderService } from '../api';
import { GymInformationCoreService, GymInformationCoreServiceInterface } from '../domain';
import { GymInformationProviderServiceInterface } from '../api/provider-services/gym-provider-service.interface';

@NgModule({
    imports: [CommonModule, MatToolbarModule, GymGeneralInformationComponent],
    exports: [GymGeneralInformationComponent],
    providers: [
        // HTTP
        {
            provide: GymInformationProviderServiceInterface,
            useClass: GymInformationProviderService,
        },
        // LOGIC STATE HANDLER / AGGREGATION
        {
            provide: GymInformationCoreServiceInterface,
            useClass: GymInformationCoreService,
        },
    ],
})
export class GymFeatureModule {}
