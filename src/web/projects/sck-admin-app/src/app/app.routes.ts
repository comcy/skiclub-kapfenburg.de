import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { AuthCallbackComponent } from './auth/auth-callback/auth-callback.component';
import { InviteAcceptComponent } from './auth/invite-accept/invite-accept.component';
import { LoginComponent } from './auth/login/login.component';
import { BoardingManagementComponent } from './boardings-management/boarding-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApplicationListComponent } from './member-management/components/application-list/application-list.component';
import { MemberAnniversariesComponent } from './member-management/components/member-anniversaries/member-anniversaries.component';
import { MemberEditRoutingDialogComponent } from './member-management/components/member-edit-routing-dialog/member-edit-routing-dialog.component';
import { MemberNewsletterComponent } from './member-management/components/member-newsletter/member-newsletter.component';
import { MemberManagementComponent } from './member-management/member-management.component';
import { CourseRegistrationsOverviewComponent } from './tile-management/components/course-registrations-overview/course-registrations-overview.component';
import { CourseRegistrationsComponent } from './tile-management/components/course-registrations/course-registrations.component';
import { CourseTileEditRoutingDialogComponent } from './tile-management/components/course-tile-edit-routing-dialog/course-tile-edit-routing-dialog.component';
import { CourseTileListComponent } from './tile-management/components/course-tile-list/course-tile-list.component';
import { EventTileEditRoutingDialogComponent } from './tile-management/components/event-tile-edit-routing-dialog/event-tile-edit-routing-dialog.component';
import { MediaManagementComponent } from './tile-management/components/media-management/media-management.component';
import { RegistrationsOverviewComponent } from './tile-management/components/registrations-overview/registrations-overview.component';
import { TileListComponent } from './tile-management/components/tile-list/tile-list.component';
import { TripRegistrationsComponent } from './tile-management/components/trip-registrations/trip-registrations.component';
import { TileManagementComponent } from './tile-management/tile-management.component';
import { PriceManagementComponent } from './settings/components/price-management/price-management.component';
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
                component: TileListComponent,
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
                { label: 'Sportkurse', link: 'sportkurse' },
                { label: 'Ski-/Snowboardkurse', link: 'skikurse' },
                { label: 'Anmeldungen', link: 'registrations' },
            ],
        },
        children: [
            {
                path: 'sportkurse',
                component: CourseTileListComponent,
                data: { courseKind: 'sport' },
            },
            {
                path: 'skikurse',
                component: CourseTileListComponent,
                data: { courseKind: 'ski' },
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
                redirectTo: 'sportkurse',
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
                { label: 'Anträge', link: 'antraege' },
                { label: 'Jubiläen', link: 'jubilaeen' },
                { label: 'Newsletter', link: 'newsletter' },
            ],
        },
        children: [
            {
                path: 'mitglieder',
                component: MemberManagementComponent,
            },
            {
                path: 'antraege',
                component: ApplicationListComponent,
            },
            {
                path: 'jubilaeen',
                component: MemberAnniversariesComponent,
            },
            {
                path: 'newsletter',
                component: MemberNewsletterComponent,
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
                { label: 'Nutzerverwaltung', link: 'users' },
                { label: 'Preismanagement', link: 'preise' },
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
                path: 'preise',
                component: PriceManagementComponent,
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
    // Auxiliary route for the member editor dialog (outlet: 'modal', see
    // app.component.html) - same pattern sck-app uses for its AGB/Satzung/
    // register dialogs. :id is a real member id or 'neu' (create), with an
    // optional ?antragId= to prefill from a pending Mitgliedsantrag.
    {
        path: 'mitglieder-bearbeiten/:id',
        component: MemberEditRoutingDialogComponent,
        outlet: 'modal',
        canActivate: [authGuard],
    },
    // Same aux-route pattern for the Sportkurse/Ski-Snowboardkurse editor
    // panel (see course-tile-edit-routing-dialog.component.ts) - two entries
    // rather than one with a :kind param, so the URL segment itself stays
    // self-descriptive (mirrors mitglieder-bearbeiten above).
    {
        path: 'sportkurs-bearbeiten/:id',
        component: CourseTileEditRoutingDialogComponent,
        outlet: 'modal',
        canActivate: [authGuard],
        data: { courseKind: 'sport' },
    },
    {
        path: 'skikurs-bearbeiten/:id',
        component: CourseTileEditRoutingDialogComponent,
        outlet: 'modal',
        canActivate: [authGuard],
        data: { courseKind: 'ski' },
    },
    // Same pattern again for Ausfahrten (Event-Management) - the "hover
    // like Sportkurse" panel this whole aux-route/MatDialog approach was
    // built for in the first place.
    {
        path: 'event-bearbeiten/:id',
        component: EventTileEditRoutingDialogComponent,
        outlet: 'modal',
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];
