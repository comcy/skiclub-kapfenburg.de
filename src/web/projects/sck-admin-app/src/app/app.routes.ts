import { Routes } from '@angular/router';
import { NotFoundComponent } from 'projects/shared-lib/src/public-api';
import { TripsRegistrationListComponent } from 'projects/trips-lib/src/public-api';
import { BoardingManagementComponent } from './boardings-management/boarding-management.component';
import { MediaPlaceholderComponent } from './tile-management/components/media-placeholder.component';
import { TileManagerComponent } from './tile-management/components/tile-manager/tile-manager.component';
import { TileManagementComponent } from './tile-management/tile-management.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'courses',
    },
    {
        path: 'courses',
        loadChildren: () =>
            import('projects/courses-lib/src/lib/feature/courses.routes').then((m) => m.COURSES_LIB_ROUTES),
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
        path: 'event-management',
        component: TileManagementComponent,
        children: [
            {
                path: 'tiles',
                component: TileManagerComponent,
            },
            {
                path: 'tiles/:id',
                component: TileManagerComponent,
            },
            {
                path: 'boardings',
                component: BoardingManagementComponent,
            },
            {
                path: 'media',
                component: MediaPlaceholderComponent,
            },
            {
                path: '',
                redirectTo: 'tiles',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];
