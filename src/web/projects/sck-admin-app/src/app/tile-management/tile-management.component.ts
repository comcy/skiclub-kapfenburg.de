import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SiteHeaderComponent } from '@shared/ui-common';

@Component({
    selector: 'app-tile-management',
    standalone: true,
    imports: [CommonModule, RouterModule, SiteHeaderComponent],
    templateUrl: './tile-management.component.html',
    styleUrls: ['./tile-management.component.scss'],
})
export class TileManagementComponent {}
