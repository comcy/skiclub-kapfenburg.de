import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteNavigationComponent } from 'projects/shared-lib/src/lib/ui-common/components/site-navigation/site-navigation.component';
import { NavigationItem } from 'projects/shared-lib/src/public-api';

// From shared-lib dependencies
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        SiteNavigationComponent,
        // Dependencies for SiteNavigationComponent
        LayoutModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'SCK Admin';
    navItems: NavigationItem[] = [
        { name: 'Kurse', route: '/courses' },
        { name: 'Registrierungen', route: '/registrations' },
        { name: 'Event Management', route: '/event-management' },
    ];
}
