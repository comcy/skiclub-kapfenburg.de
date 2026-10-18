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
        pathMatch: 'full',
    },
    // Standalone course detail page (/gymnastik/:id) - only tried once the
    // empty path above doesn't match. Mirrors trips-routing.module.ts's :id
    // route for trip-detail.
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
