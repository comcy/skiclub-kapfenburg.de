import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MarkdownRenderService } from '../../../services';

@Component({
  selector: 'lib-base-dialog',
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.scss'],
})
export class BaseDialogComponent implements OnInit {
  @Input() title?: string;
  @Input() share?: boolean;
  @Input() registerForm?: boolean;

  constructor(private dialogRef: MatDialogRef<BaseDialogComponent>,
    public markdown: MarkdownRenderService) {}

  ngOnInit(): void {
    this.registerForm = false;
    this.share = false;
  }

  public close() {
    this.dialogRef.close();
  }
}