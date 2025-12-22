/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MarkdownRenderService } from '../../../util-markdown/services';

@Component({
    selector: 'lib-base-dialog',
    templateUrl: './base-dialog.component.html',
    styleUrls: ['./base-dialog.component.scss'],
    imports: [MatButtonModule, CdkScrollable, MatDialogContent, MatToolbarModule, MatIconModule],
})
export class BaseDialogComponent implements OnInit {
    private dialogRef = inject<MatDialogRef<BaseDialogComponent>>(MatDialogRef);
    markdown = inject(MarkdownRenderService);

    @Input() title?: string;
    @Input() date?: string;
    @Input() share?: boolean;
    @Input() registerForm?: boolean;
    @Input() titleBackgroundColor?: string = 'primary';

    ngOnInit(): void {
        this.registerForm = false;
        this.share = false;
    }

    public close() {
        this.dialogRef.close();
    }
}
