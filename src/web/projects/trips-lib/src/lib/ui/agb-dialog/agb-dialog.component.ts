/**
 * @copyright Copyright (c) 2026 Christian Silfang
 */

import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'lib-agb-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './agb-dialog.component.html',
    styleUrl: './agb-dialog.component.scss',
})
export class AgbDialogComponent {}
