import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_LIB_BUTTONS_NG_MAT_MODULES } from '..';

@Component({
    selector: 'shared-lib-instagram-button',
    standalone: true,
    imports: [CommonModule, SHARED_LIB_BUTTONS_NG_MAT_MODULES],
    templateUrl: './instagram-button.component.html',
    styleUrls: ['./instagram-button.component.scss'],
})
export class InstagramButtonComponent {}
