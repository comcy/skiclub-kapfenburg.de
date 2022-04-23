import { Component } from '@angular/core';
import { NavigationItem } from 'projects/shared-lib/src/lib/components';
import { AUSFAHRTEN_ROUTE_SEGMENT, GYMNASTIK_ROUTE_SEGMENT, NEWS_ROUTE_SEGMENT, SKISCHULE_ROUTE_SEGMENT } from './route-segments';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Skiclub Kapfenburg e.V.';
  
  public baseRoute: string = '';
  public navItems: NavigationItem[] = [
    // { name: 'Skiclub Kapfenburg e.V.', route: HOME_ROUTE_SEGMENT },
    { name: 'Termine', route: NEWS_ROUTE_SEGMENT },
    { name: 'Skischule', route: SKISCHULE_ROUTE_SEGMENT },
    { name: 'Ausfahrten', route: AUSFAHRTEN_ROUTE_SEGMENT },
    { name: 'Gymnastik', route: GYMNASTIK_ROUTE_SEGMENT },
  ];

}
