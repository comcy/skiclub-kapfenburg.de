/**
 * @copyright Copyright (c) 2019 Christian Silfang
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
    selector: 'app-datenschutz',
    templateUrl: './datenschutz.component.html',
    styleUrls: ['./datenschutz.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatToolbar],
})
export class DatenschutzComponent {}
