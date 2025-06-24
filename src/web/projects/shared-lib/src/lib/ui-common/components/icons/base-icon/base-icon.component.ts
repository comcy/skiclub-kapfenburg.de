/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseIconProperties } from './base-icon.interfaces';

@Component({
    selector: 'shared-lib-base-icon',
    imports: [CommonModule, MatIconModule],
    providers: [MatIconRegistry],
    templateUrl: './base-icon.component.html',
    styleUrls: ['./base-icon.component.scss'],
    standalone: true,
})
export class BaseIconComponent {
    constructor(
        // eslint-disable-next-line @angular-eslint/prefer-inject
        protected domSanitizer: DomSanitizer,
        // eslint-disable-next-line @angular-eslint/prefer-inject
        protected matIconRegistry: MatIconRegistry,
        // eslint-disable-next-line @angular-eslint/prefer-inject
        @Inject('baseIconProperties') baseIconProperties: BaseIconProperties,
    ) {
        this.matIconRegistry.addSvgIcon(
            baseIconProperties.iconName,
            this.domSanitizer.bypassSecurityTrustResourceUrl(baseIconProperties.iconPath),
        );
    }
}
