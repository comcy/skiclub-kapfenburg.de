/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BaseIconComponent } from '../base-icon';

@Component({
    selector: 'shared-lib-instagram-icon',
    imports: [CommonModule, MatIconModule],
    templateUrl: '../base-icon/base-icon.component.html',
    styleUrls: ['../base-icon/base-icon.component.scss'],
    standalone: true,
    providers: [
        {
            provide: 'baseIconProperties',
            useValue: {
                iconName: 'instagram',
                iconPath: 'assets/logos/instagram.svg',
            },
        },
    ],
})
export class InstagramIconComponent extends BaseIconComponent {}
