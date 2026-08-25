import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './auth/services/auth.service';
import { ThemeSwitcherComponent } from './theme/theme-switcher/theme-switcher.component';

interface NavItem {
    name: string;
    route: string;
    icon: string;
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        ThemeSwitcherComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    public readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    title = 'SCK Admin';
    navExpanded = true;
    navItems: NavItem[] = [
        { name: 'Übersicht', route: '/dashboard', icon: 'dashboard' },
        { name: 'Anmeldungen', route: '/registrations', icon: 'how_to_reg' },
        { name: 'Event-Management', route: '/event-management', icon: 'grid_view' },
        { name: 'Kurs-Management', route: '/course-management', icon: 'school' },
        { name: 'Vereinsverwaltung', route: '/member-management', icon: 'badge' },
        { name: 'Einstellungen', route: '/settings', icon: 'settings' },
    ];

    ngOnInit(): void {
        // Populate the session signal so the user bar / permission-gated actions
        // render correctly even when landing on a route the auth guard doesn't cover.
        this.auth.checkSession().subscribe();
    }

    toggleNav(): void {
        this.navExpanded = !this.navExpanded;
    }

    logout(): void {
        this.auth.logout();
        this.router.navigateByUrl('/login');
    }
}
