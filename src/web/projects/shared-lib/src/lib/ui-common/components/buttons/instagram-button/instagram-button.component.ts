/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SHARED_LIB_BUTTONS_NG_MAT_MODULES } from '..';
import { BaseButtonComponent } from '../base-button/base-button.component';
import { BASE_ICON_PROPERTIES } from '../../icons/base-icon';

@Component({
    selector: 'shared-lib-instagram-button',
    imports: [CommonModule, SHARED_LIB_BUTTONS_NG_MAT_MODULES],
    templateUrl: '../base-button/base-button.component.html',
    styleUrls: ['../base-button/base-button.component.scss'],
    standalone: true,
    providers: [
        {
            provide: BASE_ICON_PROPERTIES,
            useValue: {
                iconName: 'instagram',
                iconPath: 'assets/logos/instagram.svg',
            },
        },
    ],
})
export class InstagramButtonComponent extends BaseButtonComponent {}
