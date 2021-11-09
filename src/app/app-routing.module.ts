/*
 * @copyright Copyright (c) 2021 Christian Silfang (comcy) - All Rights Reserved.  
 */


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { ImpressumComponent } from './components/impressum/impressum.component';

const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    pathMatch: 'full'
  },
  { 
    path: 'impressum',
    component: ImpressumComponent
  },
  {
    path: 'datenschutz',
    component: DatenschutzComponent
  },
  {
    path: 'desktop',
    loadChildren: () => import('./desktop/desktop.module').then((m) => m.DesktopModule)
  },
  {
    path: 'mobile',
    loadChildren: () => import('./mobile/mobile.module').then((m) => m.MobileModule)
  }
];

@NgModule({
  imports: [
    RouterModule,
    RouterModule.forRoot(appRoutes, {useHash: true, scrollPositionRestoration: 'enabled', onSameUrlNavigation: 'reload'})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
