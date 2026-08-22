/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { format, getYear, isValid } from 'date-fns';

@Component({
    imports: [],
    selector: 'shared-lib-comcy-copyright',
    templateUrl: './comcy-copyright.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./comcy-copyright.component.scss'],
})
export class ComcyCopyrightComponent {
    @Input() link!: string;
    @Input() name!: string;
    @Input() version?: string;
    @Input() buildNumber?: string;
    @Input() buildDate?: string;

    constructor() {
        this.link = 'https://github.com/comcy';
        this.name = 'comcy';
    }

    getVersionOrBuildNumber(): string {
        if (this.version) {
            return `v${this.version}`;
        } else if (this.buildNumber) {
            return `#${this.buildNumber}`;
        }
        return '';
    }

    // Shows which deployed build is currently live (helpful on dev/test
    // deployments, where the build number alone doesn't say much) - blank
    // for unset/unsubstituted (e.g. a stray "${BUILD_DATE}") values.
    getFormattedBuildDate(): string {
        if (!this.buildDate) {
            return '';
        }
        const date = new Date(this.buildDate);
        return isValid(date) ? format(date, 'dd.MM.yyyy HH:mm') : '';
    }

    getYear(): string {
        return getYear(new Date()).toString();
    }
}
