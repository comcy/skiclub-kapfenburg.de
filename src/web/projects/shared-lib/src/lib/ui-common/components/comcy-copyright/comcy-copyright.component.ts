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
    @Input() deployEnv?: string;
    @Input() gitCommitHash?: string;
    @Input() buildDate?: string;

    constructor() {
        this.link = 'https://github.com/comcy';
        this.name = 'comcy';
    }

    // "#DEV:<hash>" / "#TEST:<hash>" / "#PROD:<hash>" - which pipeline
    // built this and which commit it's running. Falls back to a semver
    // "v<version>" tag if that's set instead (not currently used anywhere,
    // kept for callers that may still pass it).
    getBuildTag(): string {
        if (this.version) {
            return `v${this.version}`;
        } else if (this.deployEnv && this.gitCommitHash) {
            return `#${this.deployEnv}:${this.gitCommitHash}`;
        }
        return '';
    }

    // Hover text for the build tag - blank for unset/unsubstituted (e.g. a
    // stray "${BUILD_DATE}") values, so no empty tooltip shows.
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
