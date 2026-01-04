import { Routes } from '@angular/router';
import { NotFoundComponent } from 'projects/shared-lib/src/lib/components/error-pages/not-found/not-found.component';
import { TripsRegistrationListComponent } from 'projects/trips-lib/src/lib/feature/trips-registration-list/trips-registration-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'courses',
    },
    // {
    //     path: 'dashboard',
    //     loadChildren: () => import('@courses-lib').then((m) => m.COURSES_LIB_ROUTES),
    // },
    {
        path: 'courses',
        loadChildren: () => import('../../../courses-app/src/app/app.routes').then((m) => m.COURSES_APP_ROUTES),
    },
    {
        path: 'registrations',
        component: TripsRegistrationListComponent,
    },
    {
        path: 'events/:eventId/registrations',
        component: TripsRegistrationListComponent,
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];
