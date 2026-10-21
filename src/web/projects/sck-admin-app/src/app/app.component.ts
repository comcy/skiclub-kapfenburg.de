import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../environments/environment';
import { AuthService } from './auth/services/auth.service';
import { NewsService } from './shared/services/news.service';
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
    private readonly news = inject(NewsService);
    private readonly destroyRef = inject(DestroyRef);

    title = 'SCK Admin';
    navExpanded = true;
    // "#TEST:abc1234" - welche Pipeline und welcher Commit hier laufen (leer lokal ohne Hash).
    readonly buildTag = environment.gitCommitHash ? `#${environment.deployEnv}:${environment.gitCommitHash}` : '';
    navItems: NavItem[] = [
        { name: 'Übersicht', route: '/dashboard', icon: 'dashboard' },
        { name: 'Anmeldungen', route: '/registrations', icon: 'how_to_reg' },
        { name: 'Event-Management', route: '/event-management', icon: 'grid_view' },
        { name: 'Kurs-Management', route: '/course-management', icon: 'school' },
        { name: 'Vereinsverwaltung', route: '/member-management', icon: 'badge' },
        { name: 'Analytics', route: '/analytics', icon: 'insights' },
        { name: 'Einstellungen', route: '/settings', icon: 'settings' },
    ];

    ngOnInit(): void {
        // Populate the session signal so the user bar / permission-gated actions
        // render correctly even when landing on a route the auth guard doesn't cover.
        this.auth.checkSession().subscribe();
        // Zaehler im Menue aktuell halten, ohne dass neu geladen werden muss.
        interval(60_000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                if (this.auth.session()) this.news.load();
            });
    }

    // Anzahl Neues je Menuepunkt (seit dem letzten Login / "Alles gesehen") - 0 = kein Badge.
    navBadge(item: NavItem): number {
        const summary = this.news.summary();
        if (!summary) return 0;
        if (item.route === '/registrations') return summary.trips.total + summary.courses.total;
        if (item.route === '/member-management') return summary.applications ?? 0;
        return 0;
    }

    toggleNav(): void {
        this.navExpanded = !this.navExpanded;
    }

    logout(): void {
        this.auth.logout();
        this.router.navigateByUrl('/login');
    }
}
