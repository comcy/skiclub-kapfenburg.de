import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { AuthCallbackComponent } from './auth/auth-callback/auth-callback.component';
import { InviteAcceptComponent } from './auth/invite-accept/invite-accept.component';
import { LoginComponent } from './auth/login/login.component';
import { BoardingManagementComponent } from './boardings-management/boarding-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MediaManagementComponent } from './tile-management/components/media-management/media-management.component';
import { TileManagerComponent } from './tile-management/components/tile-manager/tile-manager.component';
import { TileManagementComponent } from './tile-management/tile-management.component';
import { UserManagementComponent } from './user-management/user-management.component';

// Registration-management routes from the original branch (registrations list,
// courses) are intentionally dropped — superseded by the trip-registration work
// done since, out of scope for this feature (see FEATURE_BRIEF.md).
export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'invite/:token',
        component: InviteAcceptComponent,
    },
    {
        path: 'auth/callback',
        component: AuthCallbackComponent,
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
    },
    {
        path: 'event-management',
        component: TileManagementComponent,
        canActivate: [authGuard],
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
                component: MediaManagementComponent,
            },
            {
                path: '',
                redirectTo: 'tiles',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: 'user-management',
        component: UserManagementComponent,
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];
