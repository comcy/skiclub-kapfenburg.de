/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BASE_ICON_PROPERTIES, BaseIconComponent } from '../base-icon';
import { MATERIAL_COLOR } from '../../../enums';

@Component({
    selector: 'shared-lib-instagram-icon',
    imports: [CommonModule, MatIconModule],
    templateUrl: '../base-icon/base-icon.component.html',
    styleUrls: ['../base-icon/base-icon.component.scss'],
    standalone: true,
    providers: [
        {
            provide: BASE_ICON_PROPERTIES,
            useValue: {
                iconName: 'instagram',
                iconPath: 'assets/logos/instagram.svg',
                color: MATERIAL_COLOR.ACCENT,
            },
        },
    ],
})
export class InstagramIconComponent extends BaseIconComponent {}
