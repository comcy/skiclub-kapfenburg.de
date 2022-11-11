import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lib-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent implements OnInit {
  @Input() title?: string;
  @Input() share?: boolean;

  constructor(private dialogRef: MatDialogRef<ShareDialogComponent>) {}

  ngOnInit(): void {
    this.share = false;
  }

  public close() {
    this.dialogRef.close();
  }
}
