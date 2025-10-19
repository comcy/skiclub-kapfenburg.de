/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'shared-lib-sck-logo-icon',
    imports: [CommonModule, MatIconModule, MatButtonModule],
    providers: [MatIconRegistry],
    templateUrl: './sck-logo-icon.component.html',
    styleUrls: ['./sck-logo-icon.component.scss'],
})
export class SckLogoIconComponent {
    private domSanitizer = inject(DomSanitizer);
    private matIconRegistry = inject(MatIconRegistry);

    public iconName = 'sck-logo';
    public iconPath = 'assets/img/burg.svg';

    constructor() {
        this.matIconRegistry.addSvgIcon(this.iconName, this.domSanitizer.bypassSecurityTrustResourceUrl(this.iconPath));
    }
}
