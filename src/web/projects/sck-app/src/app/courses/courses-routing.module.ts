/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses.component';

const routes: Routes = [
    {
        path: '',
        component: CoursesComponent,
        children: [
            {
                path: '',
                redirectTo: 'information',
                pathMatch: 'full',
            },
            {
                path: 'information',
                loadComponent: () =>
                    import('./components/tabs/information/information.component').then(
                        (mod) => mod.InformationComponent,
                    ),
            },
            {
                path: 'registration',
                loadComponent: () =>
                    import('./components/tabs/registration/registration.component').then(
                        (mod) => mod.RegistrationComponent,
                    ),
            },
            {
                path: 'prices',
                loadComponent: () =>
                    import('./components/tabs/prices/prices.component').then((mod) => mod.PricesComponent),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CoursesRoutingModule {}
