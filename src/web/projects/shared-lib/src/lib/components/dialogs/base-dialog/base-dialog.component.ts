/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MarkdownRenderService } from '../../../util-markdown/services';

@Component({
    selector: 'lib-base-dialog',
    templateUrl: './base-dialog.component.html',
    styleUrls: ['./base-dialog.component.scss'],
    imports: [NgIf, MatButton, MatDialogTitle, CdkScrollable, MatDialogContent],
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
