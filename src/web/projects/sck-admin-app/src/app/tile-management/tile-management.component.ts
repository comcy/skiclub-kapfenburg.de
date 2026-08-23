import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SiteHeaderComponent } from '@shared/ui-common';

// Reused as the shell for both event-management (Ausfahrten/Tiles) and
// course-management (Kurse) - see app.routes.ts's `data: { title }` on each
// parent route.
@Component({
    selector: 'app-tile-management',
    standalone: true,
    imports: [CommonModule, RouterModule, SiteHeaderComponent],
    templateUrl: './tile-management.component.html',
    styleUrls: ['./tile-management.component.scss'],
})
export class TileManagementComponent {
    private readonly route = inject(ActivatedRoute);
    public readonly title = (this.route.snapshot.data['title'] as string | undefined) ?? 'Event Konfiguration';
}
