/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { setGlobalBccList } from '@data';
import { NavigationItem, NavigationItemTypes } from 'projects/shared-lib/src/lib/components';
import { environment } from '../environments/environment';
import { NewsletterSignupDialogComponent } from './components/newsletter-signup-dialog/newsletter-signup-dialog.component';
import {
    COURSES_ROUTE,
    DSGVO_ROUTE,
    GYM_ROUTE,
    HOME_ROUTE,
    IMPRESSUM_ROUTE,
    SKILIFT_ROUTE,
    TRIPS_ROUTE,
} from './route-segments';

interface NotificationBccSettingResponse {
    customBccList: string[];
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    // eslint-disable-next-line @angular-eslint/prefer-standalone
    standalone: false,
})
export class AppComponent implements OnInit {
    private readonly http = inject(HttpClient);
    private readonly dialog = inject(MatDialog);

    public title = 'Skiclub Kapfenburg e.V.';
    public logoPath = 'assets/img/sck_logo.svg';
    public routeTypes = NavigationItemTypes;
    public footerColor = 'primary';
    public contactMail = 'webmaster@skiclub-kapfenburg.de';
    public contactMailTooltip = 'Mail senden';
    public buildDate: string = environment.buildDate;
    public deployEnv: string = environment.deployEnv;
    public gitCommitHash: string = environment.gitCommitHash;

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

    // Fire-and-forget: populates the shared notification-settings-store so
    // getXConfirmationMailBcc() can use it as a fallback tier. Never blocks
    // app bootstrap - a slow/failed fetch just means the hardcoded default
    // BCC list stays in effect (see notification-settings-store.ts).
    ngOnInit(): void {
        this.http.get<NotificationBccSettingResponse>(`${environment.sckApiUrl}/settings/notification-bcc`).subscribe({
            next: (setting) => setGlobalBccList(setting.customBccList),
            error: () => {
                // keep the hardcoded fallback in mail-templates/*.ts
            },
        });
    }

    openNewsletterDialog(): void {
        this.dialog.open(NewsletterSignupDialogComponent);
    }
}
