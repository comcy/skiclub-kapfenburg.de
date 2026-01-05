/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, signal } from '@angular/core';
import { NavigationItem, NavigationItemTypes } from 'projects/shared-lib/src/lib/components';
import { environment } from '../environments/environment';
import {
    COURSES_ROUTE,
    DSGVO_ROUTE,
    GYM_ROUTE,
    HOME_ROUTE,
    IMPRESSUM_ROUTE,
    SKILIFT_ROUTE,
    TRIPS_ROUTE,
} from './route-segments';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    // eslint-disable-next-line @angular-eslint/prefer-standalone
    standalone: false,
})
export class AppComponent {
    public title = 'Skiclub Kapfenburg e.V.';
    public logoPath = 'assets/img/sck_logo.svg';
    public routeTypes = NavigationItemTypes;
    public footerColor = 'primary';
    public contactMail = 'webmaster@skiclub-kapfenburg.de';
    public contactMailTooltip = 'Mail senden';
    public buildNumber: string = environment.buildNumber;

    public navItems: NavigationItem[] = [
        { name: 'Übersicht', route: HOME_ROUTE, icon: 'home' },
        { name: 'Ski- und Snowboardschule', route: COURSES_ROUTE, icon: 'downhill_skiing' },
        { name: 'Ausfahrten', route: TRIPS_ROUTE, icon: 'directions_bus' },
        { name: 'Gymnastik', route: GYM_ROUTE, icon: 'fitness_center' },
        { name: 'Skilift', route: SKILIFT_ROUTE, icon: 'landscape', color: signal('accent') },
    ];

    public footerNavItems: NavigationItem[] = [
        { name: 'Impressum', route: IMPRESSUM_ROUTE },
        { name: 'Datenschutz', route: DSGVO_ROUTE },
    ];
}
