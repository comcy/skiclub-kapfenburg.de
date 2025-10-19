/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BASE_ICON_PROPERTIES } from './base-icon.interfaces';

@Component({
    selector: 'shared-lib-base-icon',
    imports: [CommonModule, MatIconModule],
    providers: [MatIconRegistry],
    templateUrl: './base-icon.component.html',
    styleUrls: ['./base-icon.component.scss'],
    standalone: true,
})
export class BaseIconComponent {
    protected domSanitizer = inject(DomSanitizer);
    protected matIconRegistry = inject(MatIconRegistry);
    protected baseIconProperties = inject(BASE_ICON_PROPERTIES);

    constructor() {
        this.matIconRegistry.addSvgIcon(
            this.baseIconProperties.iconName,
            this.domSanitizer.bypassSecurityTrustResourceUrl(this.baseIconProperties.iconPath),
        );
    }
}
