import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SiteHeaderComponent } from '@shared/ui-common';

@Component({
    selector: 'app-tile-management',
    standalone: true,
    imports: [CommonModule, MatTabsModule, RouterModule, SiteHeaderComponent],
    templateUrl: './tile-management.component.html',
    styleUrls: ['./tile-management.component.scss'],
})
export class TileManagementComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    public selectedIndex = 0;

    // Mapping between tab index and route path
    private tabMap = ['tiles', 'boardings', 'media'];

    ngOnInit(): void {
        this.setIndexFromRoute();

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.setIndexFromRoute();
        });
    }

    private setIndexFromRoute(): void {
        const childRoute = this.route.snapshot.firstChild;
        if (childRoute) {
            const path = childRoute.routeConfig?.path;
            if (path) {
                // Handle 'tiles/:id' case - check if path starts with or is one of the map items
                // Since routes are configured as 'tiles/:id', checking the first segment is enough or just relies on the fact that we have distinct child routes.
                // Actually, path for 'tiles/:id' in config is 'tiles/:id', so we need to match broadly.
                if (path.includes('tiles')) this.selectedIndex = 0;
                else if (path.includes('boardings')) this.selectedIndex = 1;
                else if (path.includes('media')) this.selectedIndex = 2;
            }
        }
    }

    onTabChange(index: number): void {
        const path = this.tabMap[index];
        this.router.navigate([path], { relativeTo: this.route });
    }
}
