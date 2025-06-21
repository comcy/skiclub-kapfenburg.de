import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_LIB_BUTTONS_NG_MAT_MODULES } from '..';
import { BaseButtonComponent } from '../base-button/base-button.component';

@Component({
    selector: 'shared-lib-instagram-button',
    imports: [CommonModule, BaseButtonComponent, SHARED_LIB_BUTTONS_NG_MAT_MODULES],
    templateUrl: '../base-button/base-button.component.html',
    styleUrls: ['../base-button/base-button.component.scss'],
})
export class InstagramButtonComponent extends BaseButtonComponent {
    constructor() {
        super();
    }
}
