/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseIconComponent } from '../base-icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

@Component({
    selector: 'shared-lib-instagram-icon',
    imports: [CommonModule, MatIconModule],
    templateUrl: '../base-icon/base-icon.component.html',
    styleUrls: ['../base-icon/base-icon.component.scss'],
})
export class InstagramIconComponent extends BaseIconComponent {
    constructor(domSanitizer: DomSanitizer, matIconRegistry: MatIconRegistry) {
        super(domSanitizer, matIconRegistry, { iconName: 'instagram', iconPath: 'assets/logos/instagram.svg' });
    }
}
