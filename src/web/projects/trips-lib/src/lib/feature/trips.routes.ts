import { Routes } from '@angular/router';

export const USER_LIB_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
    },
    //   {
    // path: '',
    // component: TabNavigationComponent,
    // children: [

    //   {
    //     path: 'list',
    //     loadChildren: () => import('./courses-registration-list/courses-registration-list.component').then(m => m.CoursesRegistrationListComponent),
    //   },
    //       {
    //         path: 'list',
    //         component: UserListComponent,
    //         children: [

    //         ]
    //       },
    //       {
    //         path: 'list/:id',
    //         component: UserProfileComponent
    //       },
    // ]
    //   },

    //   {
    //     path: 'add-user',
    //     component: AddUserDialogComponent,
    //     outlet: 'dialog'
    //   }
];
