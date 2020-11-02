import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { HomeComponent } from './components/home/home.component';
import { ImpressumComponent } from './components/impressum/impressum.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        children: [
          {
            path: 'skischule',
            component: HomeComponent
          },
          {
            path: 'ausfahrten',
            component: HomeComponent
          },
          {
            path: 'gymnastik',
            component: HomeComponent
          },
        ]
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
        path: 'home',
        component: HomeComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
