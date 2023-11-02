/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
                loadComponent: () =>
                    import('./components/tabs/registration/registration.component').then(
                        (mod) => mod.RegistrationComponent,
                    ),
            },
            {
                path: 'information',
                loadComponent: () =>
                    import('./components/tabs/information/information.component').then(
                        (mod) => mod.InformationComponent,
                    ),
            },
            {
                path: 'prices',
                loadComponent: () =>
                    import('./components/tabs/prices/prices.component').then((mod) => mod.PricesComponent),
            },
            {
                path: 'downloads',
                loadComponent: () =>
                    import('./components/tabs/downloads/downloads.component').then((mod) => mod.DownloadsComponent),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TripsRoutingModule {}
