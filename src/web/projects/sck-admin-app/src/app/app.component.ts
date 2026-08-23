import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './auth/services/auth.service';

interface NavItem {
    name: string;
    route: string;
    icon: string;
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatIconModule, MatButtonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    public readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    title = 'SCK Admin';
    navItems: NavItem[] = [
        { name: 'Übersicht', route: '/dashboard', icon: 'dashboard' },
        { name: 'Tiles', route: '/event-management/tiles', icon: 'grid_view' },
        { name: 'Boardings', route: '/event-management/boardings', icon: 'directions_bus' },
        { name: 'Users', route: '/user-management', icon: 'group' },
    ];

    ngOnInit(): void {
        // Populate the session signal so the user bar / permission-gated actions
        // render correctly even when landing on a route the auth guard doesn't cover.
        this.auth.checkSession().subscribe();
    }

    logout(): void {
        this.auth.logout();
        this.router.navigateByUrl('/login');
    }
}
