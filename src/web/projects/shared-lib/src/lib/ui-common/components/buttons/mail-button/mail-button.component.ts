/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_LIB_BUTTONS_NG_MAT_MODULES } from '..';
import { Router } from '@angular/router';
import { MaterialColor } from '../../../enums';

@Component({
    selector: 'shared-lib-mail-button',
    standalone: true,
    imports: [CommonModule, SHARED_LIB_BUTTONS_NG_MAT_MODULES],
    templateUrl: './mail-button.component.html',
    styleUrls: ['./mail-button.component.scss'],
})
export class MailButtonComponent {
    @Input() mailAdress: string;
    @Input() tooltip: string;
    @Input() color: MaterialColor;

    constructor(private router: Router) {
        this.mailAdress = '';
        this.tooltip = '';
        this.color = undefined;
    }

    public openMail() {
        window.location.href = `mailto:${this.mailAdress}`;
    }
}
