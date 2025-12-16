/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Component } from '@angular/core';
import { MATERIAL_COLOR } from '../../../enums';
import { BaseButtonComponent } from '../base-button/base-button.component';

@Component({
    selector: 'shared-lib-mail-button',
    imports: [BaseButtonComponent],
    templateUrl: './mail-button.component.html',
    styleUrls: ['./mail-button.component.scss'],
})
export class MailButtonComponent {
    readonly MATERIAL_COLOR = MATERIAL_COLOR;
    icon = 'mail';
    link = 'webmaster@skiclub-kapfenburg.de';
    color = MATERIAL_COLOR.ACCENT;
    tooltip = 'Mail senden';
}
