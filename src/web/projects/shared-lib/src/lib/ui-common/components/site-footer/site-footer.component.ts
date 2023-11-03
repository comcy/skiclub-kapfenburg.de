/**
 * @copyright Copyright (c) 2023 Christian Silfang
 */

import { Component, Input } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES, ANGULAR_MODULES, NavigationItem } from '../../../components';
import { ComcyCopyrightComponent } from '../comcy-copyright';
import { ActivatedRoute, Router } from '@angular/router';
import { MailButtonComponent } from '../buttons/mail-button';
import { FacebookButtonComponent, InstagramButtonComponent, WhatsappButtonComponent } from '../buttons';

@Component({
    selector: 'shared-lib-site-footer',
    standalone: true,
    imports: [
        ANGULAR_MODULES,
        ANGULAR_MATERIAL_MODULES,
        ComcyCopyrightComponent,
        MailButtonComponent,
        FacebookButtonComponent,
        InstagramButtonComponent,
        WhatsappButtonComponent,
    ],
    templateUrl: './site-footer.component.html',
    styleUrls: ['./site-footer.component.scss'],
})
export class SiteFooterComponent {
    @Input() color = 'primary';
    @Input() navItems: NavigationItem[] = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    routeTo(routeLink: string) {
        this.router.navigate([routeLink], { relativeTo: this.activatedRoute });
    }
}
