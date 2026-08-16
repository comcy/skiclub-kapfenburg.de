import { Component, ChangeDetectionStrategy } from '@angular/core';

import { SHARED_LIB_BUTTONS_NG_MAT_MODULES } from '..';

@Component({
    selector: 'shared-lib-whatsapp-button',
    imports: [SHARED_LIB_BUTTONS_NG_MAT_MODULES],
    templateUrl: './whatsapp-button.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./whatsapp-button.component.scss'],
})
export class WhatsappButtonComponent {}
