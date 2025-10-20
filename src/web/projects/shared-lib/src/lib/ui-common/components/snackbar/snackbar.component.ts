import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
    selector: 'shared-lib-snackbar',
    imports: [],
    templateUrl: './snackbar.component.html',
    styleUrl: './snackbar.component.scss',
    standalone: true,
})
export class SnackbarComponent {
    data = inject(MAT_SNACK_BAR_DATA);
    snackBarRef = inject<MatSnackBarRef<SnackbarComponent>>(MatSnackBarRef);
}
