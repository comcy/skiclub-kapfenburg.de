import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { AuthCallbackComponent } from './auth/auth-callback/auth-callback.component';
import { InviteAcceptComponent } from './auth/invite-accept/invite-accept.component';
import { LoginComponent } from './auth/login/login.component';
import { BoardingManagementComponent } from './boardings-management/boarding-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MemberAnniversariesComponent } from './member-management/components/member-anniversaries/member-anniversaries.component';
import { MemberManagementComponent } from './member-management/member-management.component';
import { CourseRegistrationsOverviewComponent } from './tile-management/components/course-registrations-overview/course-registrations-overview.component';
import { CourseRegistrationsComponent } from './tile-management/components/course-registrations/course-registrations.component';
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
        path: 'registrations',
        component: RegistrationsOverviewComponent,
        canActivate: [authGuard],
    },
    {
        path: 'registrations/:tileId',
        component: TripRegistrationsComponent,
        canActivate: [authGuard],
    },
    {
        path: 'event-management',
        component: TileManagementComponent,
        canActivate: [authGuard],
        data: {
            title: 'Event-Management',
            navLinks: [
                { label: 'Ausfahrten', link: 'tiles' },
                { label: 'Boardings', link: 'boardings' },
            ],
        },
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
        data: {
            title: 'Kurs-Management',
            navLinks: [
                { label: 'Kurse', link: 'tiles' },
                { label: 'Anmeldungen', link: 'registrations' },
            ],
        },
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
                path: 'registrations',
                component: CourseRegistrationsOverviewComponent,
            },
            {
                path: 'registrations/:tileId',
                component: CourseRegistrationsComponent,
            },
            {
                path: '',
                redirectTo: 'tiles',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: 'member-management',
        component: TileManagementComponent,
        canActivate: [authGuard],
        data: {
            title: 'Vereinsverwaltung',
            navLinks: [
                { label: 'Mitglieder', link: 'mitglieder' },
                { label: 'Jubiläen', link: 'jubilaeen' },
            ],
        },
        children: [
            {
                path: 'mitglieder',
                component: MemberManagementComponent,
            },
            {
                path: 'jubilaeen',
                component: MemberAnniversariesComponent,
            },
            {
                path: '',
                redirectTo: 'mitglieder',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: 'settings',
        component: TileManagementComponent,
        canActivate: [authGuard],
        data: {
            title: 'Einstellungen',
            navLinks: [
                { label: 'Allgemein', link: 'general' },
                { label: 'Users', link: 'users' },
                { label: 'Media', link: 'media' },
            ],
        },
        children: [
            {
                path: 'general',
                component: SettingsComponent,
            },
            {
                path: 'users',
                component: UserManagementComponent,
            },
            {
                path: 'media',
                component: MediaManagementComponent,
            },
            {
                path: '',
                redirectTo: 'general',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];
