import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_LIB_BUTTONS_NG_MAT_MODULES } from '..';
import { BaseButtonComponent } from '../base-button/base-button.component';

@Component({
    selector: 'shared-lib-facebook-button',
    standalone: true,
    imports: [CommonModule, BaseButtonComponent, SHARED_LIB_BUTTONS_NG_MAT_MODULES],
    templateUrl: './facebook-button.component.html',
    styleUrls: ['./facebook-button.component.scss'],
})
export class FacebookButtonComponent extends BaseButtonComponent {
    constructor() {
        super();
        console.log('FACEBOOK');
    }
}
