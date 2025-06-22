/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseIconProperties } from './base-icon.interfaces';

@Component({
    selector: 'shared-lib-base-icon',
    imports: [CommonModule, MatIconModule],
    providers: [MatIconRegistry],
    templateUrl: './base-icon.component.html',
    styleUrls: ['./base-icon.component.scss'],
})
export class BaseIconComponent {
    public baseIconProperties: BaseIconProperties;

    constructor(
        protected domSanitizer: DomSanitizer,
        protected matIconRegistry: MatIconRegistry,
        @Inject('baseIconProperties') baseIconProperties: BaseIconProperties,
    ) {
        this.baseIconProperties = baseIconProperties;

        this.matIconRegistry.addSvgIcon(
            baseIconProperties.iconName,
            this.domSanitizer.bypassSecurityTrustResourceUrl(baseIconProperties.iconPath),
        );
    }
}
