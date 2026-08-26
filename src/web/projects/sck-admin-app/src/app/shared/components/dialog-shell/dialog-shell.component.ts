import { Component, Input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

// Common shell for every MatDialog in this app: sticky title/actions with
// only the middle content area scrolling, and a subtly tinted header/
// actions band to set them apart from the content. Individual dialogs stay
// context-specific by projecting their own content and action buttons
// (the "dialogActions" attribute selector) rather than this component
// knowing anything about what it's editing.
@Component({
    selector: 'app-dialog-shell',
    standalone: true,
    imports: [MatDialogModule],
    templateUrl: './dialog-shell.component.html',
    styleUrls: ['./dialog-shell.component.scss'],
})
export class DialogShellComponent {
    @Input({ required: true }) title!: string;
}
