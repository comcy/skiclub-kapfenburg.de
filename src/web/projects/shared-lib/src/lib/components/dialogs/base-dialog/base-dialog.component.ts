/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { MarkdownRenderService } from '../../../util-markdown/services';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
    selector: 'lib-base-dialog',
    templateUrl: './base-dialog.component.html',
    styleUrls: ['./base-dialog.component.scss'],
    imports: [
        NgIf,
        MatButton,
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
    ],
})
export class BaseDialogComponent implements OnInit {
    @Input() title?: string;
    @Input() date?: string;
    @Input() share?: boolean;
    @Input() registerForm?: boolean;

    constructor(
        private dialogRef: MatDialogRef<BaseDialogComponent>,
        public markdown: MarkdownRenderService,
    ) {}

    ngOnInit(): void {
        this.registerForm = false;
        this.share = false;
    }

    public close() {
        this.dialogRef.close();
    }
}
