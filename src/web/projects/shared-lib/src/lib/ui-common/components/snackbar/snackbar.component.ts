import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
    selector: 'shared-lib-snackbar',
    imports: [],
    templateUrl: './snackbar.component.html',
    styleUrl: './snackbar.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
})
export class SnackbarComponent {
    data = inject(MAT_SNACK_BAR_DATA);
    snackBarRef = inject<MatSnackBarRef<SnackbarComponent>>(MatSnackBarRef);
}
