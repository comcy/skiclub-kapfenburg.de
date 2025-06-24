/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { getYear } from 'date-fns';

@Component({
    imports: [CommonModule],
    selector: 'shared-lib-comcy-copyright',
    templateUrl: './comcy-copyright.component.html',
    styleUrls: ['./comcy-copyright.component.scss'],
})
export class ComcyCopyrightComponent {
    @Input() link!: string;
    @Input() name!: string;
    @Input() version!: string;

    constructor() {
        this.link = 'https://github.com/comcy';
        this.name = 'comcy';
        this.version = 'v1.0.0';
    }

    getYear(): string {
        return getYear(new Date()).toString();
    }
}
