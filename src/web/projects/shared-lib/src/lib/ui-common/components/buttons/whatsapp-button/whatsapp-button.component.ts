import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_LIB_BUTTONS_NG_MAT_MODULES } from '..';

@Component({
    selector: 'shared-lib-whatsapp-button',
    imports: [CommonModule, SHARED_LIB_BUTTONS_NG_MAT_MODULES],
    templateUrl: './whatsapp-button.component.html',
    styleUrls: ['./whatsapp-button.component.scss'],
})
export class WhatsappButtonComponent {}
