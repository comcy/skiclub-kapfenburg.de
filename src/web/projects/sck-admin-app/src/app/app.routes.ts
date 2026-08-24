import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { AuthCallbackComponent } from './auth/auth-callback/auth-callback.component';
import { InviteAcceptComponent } from './auth/invite-accept/invite-accept.component';
import { LoginComponent } from './auth/login/login.component';
import { BoardingManagementComponent } from './boardings-management/boarding-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MemberManagementComponent } from './member-management/member-management.component';
import { MediaManagementComponent } from './tile-management/components/media-management/media-management.component';
import { RegistrationsOverviewComponent } from './tile-management/components/registrations-overview/registrations-overview.component';
import { TileManagerComponent } from './tile-management/components/tile-manager/tile-manager.component';
import { TripRegistrationsComponent } from './tile-management/components/trip-registrations/trip-registrations.component';
import { TileManagementComponent } from './tile-management/tile-management.component';
import { SettingsComponent } from './settings/settings.component';
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
        data: { title: 'Event Konfiguration' },
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
                path: 'registrations',
                component: RegistrationsOverviewComponent,
            },
            // Lives under registrations/:tileId (not tiles/:tileId/registrations)
            // so the URL - and therefore the left nav's routerLinkActive
            // highlight - stays on "Anmeldungen" instead of jumping to "Tiles"
            // when you drill into one Ausfahrt's registrations from there.
            {
                path: 'registrations/:tileId',
                component: TripRegistrationsComponent,
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
        path: 'course-management',
        component: TileManagementComponent,
        canActivate: [authGuard],
        data: { title: 'Kurse' },
        children: [
            {
                path: 'tiles',
                component: TileManagerComponent,
                data: { fixedType: 'course' },
            },
            {
                path: 'tiles/:id',
                component: TileManagerComponent,
                data: { fixedType: 'course' },
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
        path: 'member-management',
        component: MemberManagementComponent,
        canActivate: [authGuard],
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];
