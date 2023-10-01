/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadsComponent } from './components/tabs/downloads/downloads.component';
import { InformationComponent } from './components/tabs/information/information.component';
import { PricesComponent } from './components/tabs/prices/prices.component';
import { RegistrationComponent } from './components/tabs/registration/registration.component';
import { TripsComponent } from './trips.component';

const routes: Routes = [
    {
        path: '',
        component: TripsComponent,
        children: [
            {
                path: '',
                redirectTo: 'registration',
                pathMatch: 'full',
            },
            {
                path: 'registration',
                component: RegistrationComponent,
            },
            {
                path: 'information',
                component: InformationComponent,
            },
            {
                path: 'prices',
                component: PricesComponent,
            },
            {
                path: 'downloads',
                component: DownloadsComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TripsRoutingModule {}
