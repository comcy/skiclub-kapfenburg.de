import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'courses',
        // providers: [AdminService, { provide: ADMIN_API_KEY, useValue: '12345' }],
        // children: [
        //     { path: 'users', component: AdminUsersComponent },
        //     { path: 'teams', component: AdminTeamsComponent },
        // ],
        loadChildren: () => import('@courses-lib').then((m) => m.COURSES_LIB_ROUTES),
        // loadChildren: () => import('./courses-registration-list/courses-registration-list.component').then(m => m.CoursesRegistrationListComponent),
        // component: () => M.then(m => m.DashboardComponent),},
    },
];
