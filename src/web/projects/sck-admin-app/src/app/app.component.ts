import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SiteNavigationComponent } from 'projects/shared-lib/src/lib/ui-common/components/site-navigation/site-navigation.component';
import { NavigationItem } from 'projects/shared-lib/src/public-api';
import { AuthService } from './auth/services/auth.service';

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
export class AppComponent implements OnInit {
    public readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    title = 'SCK Admin';
    navItems: NavigationItem[] = [
        { name: 'Tiles', route: '/event-management/tiles' },
        { name: 'Boardings', route: '/event-management/boardings' },
    ];

    ngOnInit(): void {
        // Populate the session signal so the user bar / permission-gated actions
        // render correctly even when landing on a route the auth guard doesn't cover.
        this.auth.checkSession().subscribe();
    }

    logout(): void {
        this.auth.logout().subscribe(() => this.router.navigateByUrl('/login'));
    }
}
