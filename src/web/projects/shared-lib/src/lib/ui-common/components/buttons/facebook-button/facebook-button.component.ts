import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_LIB_BUTTONS_NG_MAT_MODULES } from '..';

@Component({
    selector: 'shared-lib-facebook-button',
    standalone: true,
    imports: [CommonModule, SHARED_LIB_BUTTONS_NG_MAT_MODULES],
    templateUrl: './facebook-button.component.html',
    styleUrls: ['./facebook-button.component.scss'],
})
export class FacebookButtonComponent {}
