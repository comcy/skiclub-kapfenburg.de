import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss'],
})
export class RegisterDialogComponent implements OnInit {
  @Input() title?: string;
  @Input() registerForm?: boolean;

  constructor(private dialogRef: MatDialogRef<RegisterDialogComponent>) {}

  ngOnInit(): void {
    this.registerForm = false;
  }

  public close() {
    this.dialogRef.close();
  }
}
