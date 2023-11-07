/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GymComponent } from './gym.component';

const routes: Routes = [
    {
        path: '',
        component: GymComponent,
        children: [
            {
                path: '',
                redirectTo: 'information',
                pathMatch: 'full',
            },
            {
                path: 'information',
                loadComponent: () =>
                    import('./components/information/information.component').then((mod) => mod.InformationComponent),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GymRoutingModule {}
