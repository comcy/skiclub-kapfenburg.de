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
        ],
    },
    // Standalone course detail page (/gymnastik/:id) - not part of the tabbed
    // shell above, only tried once none of its fixed child paths match.
    // Mirrors trips-routing.module.ts's :id route for trip-detail.
    {
        path: ':id',
        loadComponent: () =>
            import('./components/course-detail/course-detail.component').then((mod) => mod.CourseDetailComponent),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GymRoutingModule {}
