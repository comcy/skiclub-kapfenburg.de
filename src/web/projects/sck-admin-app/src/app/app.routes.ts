import { Routes } from '@angular/router';
import { BoardingManagementComponent } from './boardings-management/boarding-management.component';
import { MediaPlaceholderComponent } from './tile-management/components/media-placeholder.component';
import { TileManagerComponent } from './tile-management/components/tile-manager/tile-manager.component';
import { TileManagementComponent } from './tile-management/tile-management.component';

// Registration-management routes from the original branch (registrations list,
// courses) are intentionally dropped — superseded by the trip-registration work
// done since, out of scope for this feature (see FEATURE_BRIEF.md).
export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'event-management',
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
        redirectTo: 'event-management',
    },
];
