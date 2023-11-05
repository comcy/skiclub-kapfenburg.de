import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_LIB_BUTTONS_NG_MAT_MODULES } from '..';
import { BaseButtonComponent } from '../base-button/base-button.component';

@Component({
    selector: 'shared-lib-facebook-button',
    standalone: true,
    imports: [CommonModule, BaseButtonComponent, SHARED_LIB_BUTTONS_NG_MAT_MODULES],
    // template: '<shared-lib-base-button></shared-lib-base-button>', // DOES NOT WORK
    // templateUrl: './facebook-button.component.html', // DOES NOT WORK
    // styleUrls: ['./facebook-button.component.scss'], // DOES NOT WORK
    templateUrl: '../base-button/base-button.component.html',
    styleUrls: ['../base-button/base-button.component.scss'],
})
export class FacebookButtonComponent extends BaseButtonComponent {
    constructor() {
        super();
    }
}
