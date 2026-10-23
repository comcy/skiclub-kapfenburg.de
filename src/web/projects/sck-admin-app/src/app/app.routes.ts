import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { AuthCallbackComponent } from './auth/auth-callback/auth-callback.component';
import { InviteAcceptComponent } from './auth/invite-accept/invite-accept.component';
import { LoginComponent } from './auth/login/login.component';
import { BoardingManagementComponent } from './boardings-management/boarding-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApplicationListComponent } from './member-management/components/application-list/application-list.component';
import { TeachingTeamComponent } from './member-management/components/teaching-team/teaching-team.component';
import { MemberAnniversariesComponent } from './member-management/components/member-anniversaries/member-anniversaries.component';
import { MemberEditRoutingDialogComponent } from './member-management/components/member-edit-routing-dialog/member-edit-routing-dialog.component';
import { FeeCollectionComponent } from './member-management/components/fee-collection/fee-collection.component';
import { MemberNewsletterComponent } from './member-management/components/member-newsletter/member-newsletter.component';
import { MemberManagementComponent } from './member-management/member-management.component';
import { CourseRegistrationsOverviewComponent } from './tile-management/components/course-registrations-overview/course-registrations-overview.component';
import { CourseRegistrationsComponent } from './tile-management/components/course-registrations/course-registrations.component';
import { CourseTileEditRoutingDialogComponent } from './tile-management/components/course-tile-edit-routing-dialog/course-tile-edit-routing-dialog.component';
import { CourseTileListComponent } from './tile-management/components/course-tile-list/course-tile-list.component';
import { EventTileEditRoutingDialogComponent } from './tile-management/components/event-tile-edit-routing-dialog/event-tile-edit-routing-dialog.component';
import { MediaManagementComponent } from './tile-management/components/media-management/media-management.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { RegistrationsOverviewComponent } from './tile-management/components/registrations-overview/registrations-overview.component';
import { TileListComponent } from './tile-management/components/tile-list/tile-list.component';
import { TripRegistrationsComponent } from './tile-management/components/trip-registrations/trip-registrations.component';
import { TileManagementComponent } from './tile-management/tile-management.component';
import { MailTemplateManagementComponent } from './settings/components/mail-template-management/mail-template-management.component';
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
        component: TileManagementComponent,
        canActivate: [authGuard],
        data: {
            title: 'Anmeldungen',
            navLinks: [
                { label: 'Ausfahrten', link: 'ausfahrten' },
                { label: 'Kurse', link: 'kurse' },
            ],
        },
        children: [
            {
                path: 'ausfahrten',
                component: RegistrationsOverviewComponent,
            },
            {
                path: 'ausfahrten/:tileId',
                component: TripRegistrationsComponent,
            },
            {
                path: 'kurse',
                component: CourseRegistrationsOverviewComponent,
            },
            {
                path: 'kurse/:tileId',
                component: CourseRegistrationsComponent,
            },
            {
                path: '',
                redirectTo: 'ausfahrten',
                pathMatch: 'full',
            },
        ],
    },
    // Alte Adresse (Lesezeichen, Mails): /registrations/<tileId> war die
    // Ausfahrts-Anmeldeliste. Steht NACH der Shell-Route, damit
    // /registrations/ausfahrten|kurse zuerst dort landen.
    {
        path: 'registrations/:tileId',
        redirectTo: 'registrations/ausfahrten/:tileId',
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
            // Anmeldungen der Kurse leben jetzt unter /registrations/kurse (alte Links bleiben gültig).
            {
                path: 'registrations',
                redirectTo: '/registrations/kurse',
                pathMatch: 'full',
            },
            {
                path: 'registrations/:tileId',
                redirectTo: '/registrations/kurse/:tileId',
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
                { label: 'Lehrteam', link: 'lehrteam' },
                { label: 'Jubiläen', link: 'jubilaeen' },
                { label: 'Newsletter', link: 'newsletter' },
                { label: 'Beitragseinzug', link: 'beitragseinzug' },
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
                path: 'lehrteam',
                component: TeachingTeamComponent,
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
                path: 'beitragseinzug',
                component: FeeCollectionComponent,
            },
            {
                path: '',
                redirectTo: 'mitglieder',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: 'analytics',
        component: TileManagementComponent,
        canActivate: [authGuard],
        data: {
            title: 'Analytics',
            navLinks: [],
        },
        children: [
            {
                path: '',
                component: AnalyticsComponent,
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
                { label: 'Mailtexte', link: 'mailtexte' },
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
                path: 'mailtexte',
                component: MailTemplateManagementComponent,
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
