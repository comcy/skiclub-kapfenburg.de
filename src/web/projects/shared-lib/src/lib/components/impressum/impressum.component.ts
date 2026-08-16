/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
    selector: 'app-impressum',
    templateUrl: './impressum.component.html',
    styleUrls: ['./impressum.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatToolbar],
})
export class ImpressumComponent {}
