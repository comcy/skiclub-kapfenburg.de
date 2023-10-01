/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatenschutzComponent } from 'projects/shared-lib/src/lib/components/datenschutz';
import { ImpressumComponent } from 'projects/shared-lib/src/lib/components/impressum';
import { HomeComponent } from './components';
import {
    COURSES_ROUTE,
    DSGVO_ROUTE,
    EMPTY_ROUTE,
    GYM_ROUTE,
    HOME_ROUTE,
    IMPRESSUM_ROUTE,
    TRIPS_ROUTE,
} from './route-segments';

const routes: Routes = [
    {
        path: HOME_ROUTE,
        component: HomeComponent,
    },
    {
        path: COURSES_ROUTE,
        loadChildren: () => import('./courses/courses.module').then((m) => m.CoursesModule),
    },
    {
        path: GYM_ROUTE,
        loadChildren: () => import('./gym/gym.module').then((m) => m.GymModule),
    },
    {
        path: TRIPS_ROUTE,
        loadChildren: () => import('./trips/trips.module').then((m) => m.TripsModule),
    },
    {
        path: IMPRESSUM_ROUTE,
        component: ImpressumComponent,
    },
    {
        path: DSGVO_ROUTE,
        component: DatenschutzComponent,
    },
    {
        path: EMPTY_ROUTE,
        pathMatch: 'full',
        redirectTo: HOME_ROUTE,
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: HOME_ROUTE,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
