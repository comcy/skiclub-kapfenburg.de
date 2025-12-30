import { Routes } from '@angular/router';
import { NotFoundComponent } from 'projects/shared-lib/src/lib/components/error-pages/not-found/not-found.component';

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
        loadChildren: () => import('@courses-lib').then((m) => m.COURSES_LIB_ROUTES),
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];
