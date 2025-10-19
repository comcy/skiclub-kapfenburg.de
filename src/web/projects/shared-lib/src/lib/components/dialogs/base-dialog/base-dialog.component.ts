/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MarkdownRenderService } from '../../../util-markdown/services';

@Component({
    selector: 'lib-base-dialog',
    templateUrl: './base-dialog.component.html',
    styleUrls: ['./base-dialog.component.scss'],
    standalone: false,
})
export class BaseDialogComponent implements OnInit {
    private dialogRef = inject<MatDialogRef<BaseDialogComponent>>(MatDialogRef);
    markdown = inject(MarkdownRenderService);

    @Input() title?: string;
    @Input() date?: string;
    @Input() share?: boolean;
    @Input() registerForm?: boolean;

    ngOnInit(): void {
        this.registerForm = false;
        this.share = false;
    }

    public close() {
        this.dialogRef.close();
    }
}
