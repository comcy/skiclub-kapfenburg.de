import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './auth/services/auth.service';

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
        { name: 'Tiles', route: '/event-management/tiles', icon: 'grid_view' },
        { name: 'Kurse', route: '/course-management/tiles', icon: 'school' },
        { name: 'Boardings', route: '/event-management/boardings', icon: 'directions_bus' },
        { name: 'Media', route: '/event-management/media', icon: 'photo_library' },
        { name: 'Users', route: '/user-management', icon: 'group' },
        { name: 'Mitglieder', route: '/member-management', icon: 'badge' },
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
