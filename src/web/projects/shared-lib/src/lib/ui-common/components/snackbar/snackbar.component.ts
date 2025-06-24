import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
    selector: 'shared-lib-snackbar',
    imports: [],
    templateUrl: './snackbar.component.html',
    styleUrl: './snackbar.component.scss',
    standalone: true,
})
export class SnackbarComponent {
    constructor(
        // eslint-disable-next-line @angular-eslint/prefer-inject
        @Inject(MAT_SNACK_BAR_DATA) public data: string,
        // eslint-disable-next-line @angular-eslint/prefer-inject
        public snackBarRef: MatSnackBarRef<SnackbarComponent>,
    ) {}
}
