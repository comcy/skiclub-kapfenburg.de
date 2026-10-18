import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

// Common shell for every MatDialog in this app: sticky title/actions with
// only the middle content area scrolling, and a tinted header band (with
// its own close "X", same as the course-tile editor's bespoke toolbar) to
// set it apart from the content. Individual dialogs stay context-specific
// by projecting their own content and action buttons (the "dialogActions"
// attribute selector) rather than this component knowing anything about
// what it's editing.
@Component({
    selector: 'app-dialog-shell',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: './dialog-shell.component.html',
    styleUrls: ['./dialog-shell.component.scss'],
})
export class DialogShellComponent {
    @Input({ required: true }) title!: string;

    // Untyped on purpose: MatDialogRef is provided per-dialog-instance by
    // the CDK overlay regardless of which specific dialog component asked
    // for it, so this resolves to the same ref the hosting dialog's own
    // Speichern/Abbrechen buttons already close - .close() doesn't care
    // about the generic result type at the call site.
    private readonly dialogRef = inject(MatDialogRef);

    onClose(): void {
        this.dialogRef.close(false);
    }
}
