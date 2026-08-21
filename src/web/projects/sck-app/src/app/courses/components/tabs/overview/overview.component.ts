/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MarkdownRenderService } from '@shared/util-markdown';
import { COURSE_LEVEL_TILES } from 'projects/data/static';

@Component({
    selector: 'app-courses-overview',
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class OverviewComponent {
    public levelTiles = COURSE_LEVEL_TILES;
    public markdown = inject(MarkdownRenderService);

    private router = inject(Router);

    public openRegistration(): void {
        this.router.navigate(['/courses/registration']);
    }
}
