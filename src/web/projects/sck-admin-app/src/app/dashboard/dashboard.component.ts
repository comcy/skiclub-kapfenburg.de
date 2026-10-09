import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '@shared/ui-common';
import { DashboardDataService } from './services/dashboard-data.service';
import { ActivityEntry, DashboardStats } from './domain/dashboard';
import { relativeTime } from './domain/relative-time';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterLink, SiteHeaderComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    private readonly dataService = inject(DashboardDataService);
    private readonly cdr = inject(ChangeDetectorRef);

    public stats: DashboardStats | null = null;
    public activity: ActivityEntry[] = [];
    public readonly relativeTime = relativeTime;

    ngOnInit(): void {
        // The app runs zoneless (see app.config.ts) - state set inside an
        // HttpClient subscribe callback needs an explicit markForCheck() to
        // reach the view, see the same fix in login/user-management.
        this.dataService.load().subscribe(({ stats, activity }) => {
            this.stats = stats;
            this.activity = activity;
            this.cdr.markForCheck();
        });
    }
}
