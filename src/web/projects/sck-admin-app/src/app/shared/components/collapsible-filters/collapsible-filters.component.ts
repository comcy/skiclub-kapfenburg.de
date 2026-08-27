import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Wraps a list's existing filter row (search/status/etc.) behind a toggle,
// unchanged inside - on a phone-width screen several filter fields side by
// side can eat most of the visible list area, so every list gets the
// ability to hide them rather than each one growing its own boolean/toggle
// button. Defaults open so desktop behavior doesn't change.
@Component({
    selector: 'app-collapsible-filters',
    standalone: true,
    imports: [MatButtonModule, MatIconModule],
    template: `
        <button mat-stroked-button type="button" class="filter-toggle" (click)="expanded = !expanded">
            <mat-icon>{{ expanded ? 'expand_less' : 'expand_more' }}</mat-icon>
            Filter
        </button>
        @if (expanded) {
            <ng-content></ng-content>
        }
    `,
    styles: [
        `
            .filter-toggle {
                margin: 8px 0;
            }
        `,
    ],
})
export class CollapsibleFiltersComponent {
    expanded = true;
}
