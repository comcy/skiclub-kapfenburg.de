/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BaseIconComponent } from '../base-icon/base-icon.component';
import { BASE_ICON_PROPERTIES } from '../base-icon';

@Component({
    selector: 'shared-lib-sck-logo-icon',
    imports: [CommonModule, MatIconModule],
    templateUrl: '../base-icon/base-icon.component.html',
    styleUrls: ['../base-icon/base-icon.component.scss'],
    standalone: true,
    providers: [
        {
            provide: BASE_ICON_PROPERTIES,
            useValue: {
                iconName: 'sck-logo',
                iconPath: 'assets/img/burg.svg',
            },
        },
    ],
})
export class SckLogoIconComponent extends BaseIconComponent {}
