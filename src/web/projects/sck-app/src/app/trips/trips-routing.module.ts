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
                redirectTo: 'overview',
                pathMatch: 'full',
            },
            {
                path: 'overview',
                loadComponent: () =>
                    import('./components/tabs/overview/overview.component').then((mod) => mod.OverviewComponent),
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
    // Standalone trip detail page (/trips/:id) - not part of the tabbed
    // shell above, only tried once none of its fixed child paths match.
    {
        path: ':id',
        loadComponent: () =>
            import('./components/trip-detail/trip-detail.component').then((mod) => mod.TripDetailComponent),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TripsRoutingModule {}
