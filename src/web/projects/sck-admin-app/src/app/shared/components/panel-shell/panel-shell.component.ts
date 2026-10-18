import { Component, Input } from '@angular/core';

// Every routed child of tile-management's shell (settings/*, member-management/*)
// needs to establish its own bounded, scrollable region - that shell clips
// (overflow: hidden) rather than scrolls by design, see
// tile-management.component.scss. Getting this wrong is invisible until
// someone scrolls a long page (see CLAUDE.md) - use this shell instead of
// reimplementing the :host/.content-area flex chain per page.
@Component({
    selector: 'app-panel-shell',
    standalone: true,
    templateUrl: './panel-shell.component.html',
    styleUrls: ['./panel-shell.component.scss'],
})
export class PanelShellComponent {
    // Readability cap for the inner content column, e.g. '600px' for a
    // narrow settings form. Omit for content that should use the panel's
    // full width (tables, side-by-side editor+preview layouts, ...).
    @Input() maxWidth: string | null = null;
}
