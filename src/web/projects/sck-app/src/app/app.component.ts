import { Component } from '@angular/core';
import { NavigationItem } from 'projects/shared-lib/src/lib/components';
import { COURSES_ROUTE, GYM_ROUTE, TRIPS_ROUTE } from './route-segments';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Skiclub Kapfenburg e.V.';

  public navItems: NavigationItem[] = [
    { name: 'Ski- und Snowboardschule', route: COURSES_ROUTE },
    { name: 'Ausfahrten', route: TRIPS_ROUTE },
    { name: 'Gymnastik', route: GYM_ROUTE },
  ];

}
