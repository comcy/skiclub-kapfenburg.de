/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component } from '@angular/core';
import { NavigationItem, NavigationItemTypes } from 'projects/shared-lib/src/lib/components';
import { COURSES_ROUTE, DSGVO_ROUTE, GYM_ROUTE, HOME_ROUTE, IMPRESSUM_ROUTE, TRIPS_ROUTE } from './route-segments';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public title = 'Skiclub Kapfenburg e.V.';
    public routeTypes = NavigationItemTypes;
    public footerColor = 'primary';

    public contactMail = 'webmaster@skiclub-kapfenburg.de';
    public contactMailTooltip = 'Mail senden';

    public navItems: NavigationItem[] = [
        { name: 'Übersicht', route: HOME_ROUTE },
        { name: 'Ski- und Snowboardschule', route: COURSES_ROUTE },
        { name: 'Ausfahrten', route: TRIPS_ROUTE },
        { name: 'Gymnastik', route: GYM_ROUTE },
    ];

    public footerNavItems: NavigationItem[] = [
        { name: 'Impressum', route: IMPRESSUM_ROUTE },
        { name: 'Datenschutz', route: DSGVO_ROUTE },
    ];

    // TODO: Remove
    // public highlightedNavItems: NavigationItem[] = [
    //   { name: 'Mitgliedsantrag', route: GYM_ROUTE, routeType: NavigationItemTypes.ExternalRoute },
    // ];
}
