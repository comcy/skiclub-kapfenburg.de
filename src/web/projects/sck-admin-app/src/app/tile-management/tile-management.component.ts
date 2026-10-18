import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { SiteHeaderComponent } from '@shared/ui-common';

export interface SectionNavLink {
    label: string;
    link: string;
}

// Reused as the shell for event-management (Ausfahrten/Boardings),
// course-management (Kurse/Anmeldungen) and settings (Allgemein/Users/
// Media) - see app.routes.ts's `data: { title, navLinks }` on each parent
// route. Sub-items are shown as top tabs, mirroring sck-app's
// trips.component.html pattern.
@Component({
    selector: 'app-tile-management',
    standalone: true,
    imports: [CommonModule, RouterModule, MatTabsModule, SiteHeaderComponent],
    templateUrl: './tile-management.component.html',
    styleUrls: ['./tile-management.component.scss'],
})
export class TileManagementComponent {
    private readonly route = inject(ActivatedRoute);
    public readonly title = (this.route.snapshot.data['title'] as string | undefined) ?? 'Event Konfiguration';
    public readonly navLinks = (this.route.snapshot.data['navLinks'] as SectionNavLink[] | undefined) ?? [];
}
